import { useState } from "react";
import { supabase } from "@/lib/supabase";

type SyncReport = {
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

export default function ImovelwebImport({ onImported }: { onImported: () => Promise<void> }) {
  const [source, setSource] = useState("");
  const [report, setReport] = useState<SyncReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"preview" | "apply" | null>(null);

  async function run(apply: boolean) {
    setError("");
    setLoading(apply ? "apply" : "preview");

    try {
      const listings = JSON.parse(source);
      if (!Array.isArray(listings) || listings.length === 0) {
        throw new Error("A coleta do Imovelweb está vazia.");
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("A sessão administrativa expirou.");

      const response = await fetch("/api/imovelweb-sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apply, listings }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Falha na sincronização.");

      setReport(result);
      if (apply) await onImported();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Falha na sincronização.");
    } finally {
      setLoading(null);
    }
  }

  const canApply =
    report && report.review.length === 0 && report.errors.length === 0 && !loading;

  return (
    <section className="mb-10 border border-border/20 rounded-sm p-6 space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Sincronização
          </p>
          <h2 className="mt-2 text-xl font-light">Importar do Imovelweb</h2>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            A referência EX é a chave oficial. Códigos existentes são ignorados e novos
            imóveis entram como rascunho para revisão.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!source.trim() || Boolean(loading)}
            onClick={() => run(false)}
            className="border border-border/40 rounded-sm px-4 py-2 text-xs disabled:opacity-40"
          >
            {loading === "preview" ? "Analisando..." : "Gerar prévia"}
          </button>
          <button
            type="button"
            disabled={!canApply}
            onClick={() => run(true)}
            className="bg-foreground text-background rounded-sm px-4 py-2 text-xs disabled:opacity-30"
          >
            {loading === "apply" ? "Importando..." : "Importar rascunhos"}
          </button>
        </div>
      </div>

      <textarea
        aria-label="Dados coletados do Imovelweb"
        value={source}
        onChange={(event) => {
          setSource(event.target.value);
          setReport(null);
        }}
        placeholder="A coleta preparada pelo agente aparecerá aqui."
        className="min-h-28 w-full resize-y rounded-sm border border-border/30 bg-background p-3 font-mono text-[11px] outline-none focus:border-foreground/40"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      {report && (
        <div className="grid gap-3 md:grid-cols-4 text-xs">
          <Result label="Novos" values={report.created} />
          <Result label="Ignorados" values={report.unchanged} />
          <Result label="Revisar" values={report.review.map((item) => item.sourceListingId)} />
          <Result label="Erros" values={report.errors.map((item) => item.sourceListingId)} />
        </div>
      )}
    </section>
  );
}

function Result({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="border border-border/20 rounded-sm p-4">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-light">{values.length}</p>
      {values.length > 0 && <p className="mt-2 break-words text-[10px]">{values.join(", ")}</p>}
    </div>
  );
}

