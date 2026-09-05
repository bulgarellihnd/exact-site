import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { synchronizeImovelweb } from "../server/imovelweb/sync.js";

const listingSchema = z.object({
  sourceListingId: z.string().regex(/^\d+$/),
  propertyCode: z.string().regex(/^EX\d+$/i),
  sourceUrl: z.string().url().refine((url) => new URL(url).hostname.endsWith("imovelweb.com.br")),
  title: z.string().min(1),
  description: z.string(),
  operation: z.enum(["locacao", "aquisicao"]),
  propertyType: z.string().min(1),
  location: z.string().min(1),
  price: z.number().nullable(),
  condominiumPrice: z.number().nullable(),
  iptuPrice: z.number().nullable(),
  totalArea: z.number().nullable(),
  privateArea: z.number().nullable(),
  bedrooms: z.number().int().nullable(),
  bathrooms: z.number().int().nullable(),
  suites: z.number().int().nullable(),
  parkingSpots: z.number().int().nullable(),
  imageUrls: z
    .array(
      z.string().url().refine((url) => new URL(url).hostname === "imgbr.imovelwebcdn.com")
    )
    .min(1),
});

const requestSchema = z.object({
  apply: z.boolean().default(false),
  listings: z.array(listingSchema).min(1).max(100),
});

type ApiRequest = {
  method?: string;
  headers: { authorization?: string };
  body?: unknown;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido" });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !anonKey || !serviceKey) {
    res.status(503).json({ error: "Integração ainda não configurada no servidor" });
    return;
  }

  const bearer = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!bearer) {
    res.status(401).json({ error: "Sessão administrativa necessária" });
    return;
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(bearer);
  if (authError || !authData.user) {
    res.status(401).json({ error: "Sessão administrativa inválida" });
    return;
  }

  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dados de importação inválidos", details: parsed.error.flatten() });
    return;
  }

  try {
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const report = await synchronizeImovelweb(adminClient, parsed.data.listings, {
      apply: parsed.data.apply,
    });
    res.status(200).json(report);
  } catch (caught) {
    res.status(500).json({
      error: caught instanceof Error ? caught.message : "Falha na sincronização",
    });
  }
}

