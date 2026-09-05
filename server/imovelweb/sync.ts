import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { reconcileListings } from "./reconcile.js";
import type {
  ExistingProperty,
  ImovelwebListing,
  SyncDecision,
} from "./types.js";

export type SyncReport = {
  created: string[];
  updated: string[];
  unchanged: string[];
  review: Array<{
    sourceListingId: string;
    suggestedPropertyCode: string | null;
    confidence: number;
    reasons: string[];
  }>;
  errors: Array<{ sourceListingId: string; message: string }>;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fingerprint(listing: ImovelwebListing) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        ...listing,
        sourceUrl: listing.sourceUrl.split("?")[0],
      })
    )
    .digest("hex");
}

function extensionFor(contentType: string | null, url: string) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("avif")) return "avif";
  const match = url.match(/\.(jpe?g|png|webp|avif)(?:\?|$)/i);
  return match?.[1]?.toLowerCase().replace("jpeg", "jpg") ?? "jpg";
}

async function copyImages(
  supabase: SupabaseClient,
  propertyId: number,
  propertyCode: string,
  urls: string[]
) {
  const uploaded: Array<{
    property_id: number;
    image_url: string;
    storage_path: string;
    sort_order: number;
    is_cover: boolean;
  }> = [];

  for (const [index, url] of urls.entries()) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Foto ${index + 1}: HTTP ${response.status}`);
    }

    const bytes = await response.arrayBuffer();
    const extension = extensionFor(response.headers.get("content-type"), url);
    const storagePath = `imports/${propertyCode}/${String(index + 1).padStart(3, "0")}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("properties")
      .upload(storagePath, bytes, {
        contentType: response.headers.get("content-type") ?? "image/jpeg",
        upsert: true,
      });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("properties").getPublicUrl(storagePath);
    uploaded.push({
      property_id: propertyId,
      image_url: data.publicUrl,
      storage_path: storagePath,
      sort_order: index,
      is_cover: index === 0,
    });
  }

  const { error: deleteError } = await supabase
    .from("property_images")
    .delete()
    .eq("property_id", propertyId);
  if (deleteError) throw deleteError;

  if (uploaded.length) {
    const { error: insertError } = await supabase
      .from("property_images")
      .insert(uploaded);
    if (insertError) throw insertError;
  }

  return uploaded[0]?.image_url ?? null;
}

function propertyPayload(listing: ImovelwebListing, now: string) {
  return {
    title: listing.title,
    slug: slugify(`${listing.title}-${listing.sourceListingId}`),
    operation: listing.operation === "locacao" ? "Locação" : "Aquisição",
    property_type: listing.propertyType,
    location: listing.location,
    price: listing.price,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    parking_spots: listing.parkingSpots,
    suites: listing.suites,
    area: listing.privateArea ?? listing.totalArea,
    status: "Disponível",
    description: listing.description,
    source_provider: "imovelweb",
    source_listing_id: listing.sourceListingId,
    source_url: listing.sourceUrl.split("?")[0],
    source_fingerprint: fingerprint(listing),
    source_last_seen_at: now,
    source_last_synced_at: now,
    source_sync_state: "synced",
  };
}

async function applyDecision(
  supabase: SupabaseClient,
  decision: SyncDecision,
  properties: ExistingProperty[]
) {
  const now = new Date().toISOString();
  const payload = propertyPayload(decision.listing, now);

  if (decision.action === "create") {
    const propertyCode = decision.listing.propertyCode.toUpperCase();
    const { data, error } = await supabase
      .from("properties")
      .insert({ ...payload, property_code: propertyCode, is_published: false })
      .select("id")
      .single();
    if (error) throw error;

    const coverImage = await copyImages(
      supabase,
      data.id,
      propertyCode,
      decision.listing.imageUrls
    );
    if (coverImage) {
      const { error: coverError } = await supabase
        .from("properties")
        .update({ cover_image: coverImage })
        .eq("id", data.id);
      if (coverError) throw coverError;
    }
    properties.push({
      id: data.id,
      propertyCode,
      title: decision.listing.title,
      location: decision.listing.location,
      operation: payload.operation,
      price: decision.listing.price,
      area: decision.listing.privateArea,
      sourceListingId: decision.listing.sourceListingId,
      editorialLock: false,
    });
    return propertyCode;
  }

  if (!decision.property) throw new Error("Imóvel de destino não encontrado");
  const { error } = await supabase
    .from("properties")
    .update(payload)
    .eq("id", decision.property.id);
  if (error) throw error;

  if (!decision.property.editorialLock) {
    const coverImage = await copyImages(
      supabase,
      decision.property.id,
      decision.property.propertyCode ?? `property-${decision.property.id}`,
      decision.listing.imageUrls
    );
    if (coverImage) {
      const { error: coverError } = await supabase
        .from("properties")
        .update({ cover_image: coverImage })
        .eq("id", decision.property.id);
      if (coverError) throw coverError;
    }
  }
  return decision.property.propertyCode ?? String(decision.property.id);
}

export async function synchronizeImovelweb(
  supabase: SupabaseClient,
  listings: ImovelwebListing[],
  options: { apply: boolean }
): Promise<SyncReport> {
  const { data, error } = await supabase.from("properties").select(
    "id, property_code, title, location, operation, price, area, source_listing_id, source_editorial_lock, source_fingerprint"
  );
  if (error) throw error;

  const properties: ExistingProperty[] = (data ?? []).map((property) => ({
    id: property.id,
    propertyCode: property.property_code,
    title: property.title,
    location: property.location,
    operation: property.operation,
    price: property.price,
    area: property.area,
    sourceListingId: property.source_listing_id,
    editorialLock: property.source_editorial_lock ?? false,
  }));

  const storedFingerprints = new Map(
    (data ?? []).map((property) => [property.source_listing_id, property.source_fingerprint])
  );
  const decisions = reconcileListings(listings, properties);
  const report: SyncReport = {
    created: [],
    updated: [],
    unchanged: [],
    review: [],
    errors: [],
  };

  for (const decision of decisions) {
    if (decision.action === "unchanged") {
      report.unchanged.push(
        decision.property?.propertyCode ?? decision.listing.propertyCode
      );
      continue;
    }

    if (decision.action === "review") {
      report.review.push({
        sourceListingId: decision.listing.sourceListingId,
        suggestedPropertyCode: decision.property?.propertyCode ?? null,
        confidence: decision.confidence,
        reasons: decision.reasons,
      });
      continue;
    }

    if (
      decision.action === "update" &&
      storedFingerprints.get(decision.listing.sourceListingId) === fingerprint(decision.listing)
    ) {
      report.unchanged.push(decision.property?.propertyCode ?? decision.listing.sourceListingId);
      continue;
    }

    if (!options.apply) {
      (decision.action === "create" ? report.created : report.updated).push(
        decision.property?.propertyCode ?? decision.listing.sourceListingId
      );
      continue;
    }

    try {
      const code = await applyDecision(supabase, decision, properties);
      (decision.action === "create" ? report.created : report.updated).push(code);
    } catch (caught) {
      report.errors.push({
        sourceListingId: decision.listing.sourceListingId,
        message: caught instanceof Error ? caught.message : "Erro desconhecido",
      });
    }
  }

  return report;
}

