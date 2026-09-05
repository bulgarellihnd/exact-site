import type {
  ExistingProperty,
  ImovelwebListing,
  SyncDecision,
} from "./types.js";

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(rua|r\.?|avenida|av\.?)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function addressScore(source: string, target: string | null) {
  const left = new Set(normalize(source).split(" ").filter(Boolean));
  const right = new Set(normalize(target).split(" ").filter(Boolean));
  if (!left.size || !right.size) return 0;
  const overlap = [...left].filter((part) => right.has(part)).length;
  return overlap / Math.max(left.size, right.size);
}

function near(a: number | null, b: number | null, tolerance: number) {
  if (a == null || b == null) return false;
  return Math.abs(a - b) <= tolerance;
}

export function reconcileListings(
  listings: ImovelwebListing[],
  properties: ExistingProperty[]
): SyncDecision[] {
  const codeCounts = listings.reduce<Record<string, number>>((counts, listing) => {
    const code = listing.propertyCode.toUpperCase();
    counts[code] = (counts[code] ?? 0) + 1;
    return counts;
  }, {});

  return listings.map((listing) => {
    if (codeCounts[listing.propertyCode.toUpperCase()] > 1) {
      return {
        action: "review",
        listing,
        confidence: 1,
        reasons: ["Referência EXACT repetida em anúncios distintos no Imovelweb"],
      };
    }

    const codeMatch = properties.find(
      (property) =>
        property.propertyCode?.toUpperCase() === listing.propertyCode.toUpperCase()
    );

    // EXACT's own reference is authoritative. If it already exists, the importer
    // leaves the complete record and its editorial content untouched.
    if (codeMatch) {
      return {
        action: "unchanged",
        listing,
        property: codeMatch,
        confidence: 1,
        reasons: ["Referência EXACT já cadastrada"],
      };
    }

    const exactIdMatch = properties.find(
      (property) => property.sourceListingId === listing.sourceListingId
    );

    if (exactIdMatch) {
      return {
        action: "review",
        listing,
        property: exactIdMatch,
        confidence: 1,
        reasons: ["ID do Imovelweb já vinculado a outra referência EXACT"],
      };
    }

    const candidates = properties
      .map((property) => {
        let confidence = addressScore(listing.location, property.location) * 0.7;
        const reasons: string[] = [];

        if (confidence >= 0.5) reasons.push("Endereço equivalente");
        if (near(listing.privateArea, property.area, 2)) {
          confidence += 0.2;
          reasons.push("Área privativa equivalente");
        }
        if (normalize(listing.operation) === normalize(property.operation)) {
          confidence += 0.1;
          reasons.push("Mesma operação");
        }

        return { property, confidence: Math.min(confidence, 0.99), reasons };
      })
      .sort((a, b) => b.confidence - a.confidence);

    const best = candidates[0];
    // Automatic linking requires strong address + unit characteristics.
    // Same-building units are deliberately sent to review instead of merged.
    if (best && best.confidence >= 0.86) {
      return {
        action: "review",
        listing,
        property: best.property,
        confidence: best.confidence,
        reasons: [...best.reasons, "Vínculo inicial precisa de confirmação"],
      };
    }

    return {
      action: "create",
      listing,
      confidence: best?.confidence ?? 0,
      reasons: ["Nenhum imóvel existente corresponde com segurança"],
    };
  });
}

