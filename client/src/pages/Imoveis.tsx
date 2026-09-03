import { AnimatePresence, motion } from "framer-motion";
import { Car, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

const whatsappLink = "https://wa.me/5541999723780?text=Ol%C3%A1.%20Tenho%20interesse%20em%20um%20im%C3%B3vel%20da%20EXACT%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";
const heroExcludedPropertyCodes = new Set(["EX0009"]);
type SortOption = "recent" | "price-asc" | "price-desc" | "area-asc" | "area-desc";
type Property = {
  id: number; property_code: string | null; created_at: string; title: string | null;
  slug: string | null; operation: string | null; property_type: string | null;
  price: number | null; location: string | null; bedrooms: number | null;
  bathrooms: number | null; parking_spots: number | null; area: number | null;
  status: string | null; cover_image: string | null; is_published: boolean | null;
  hero_enabled?: boolean | null; hero_order?: number | null;
};

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: "Mais recentes", value: "recent" }, { label: "Menor valor", value: "price-asc" },
  { label: "Maior valor", value: "price-desc" }, { label: "Menor área", value: "area-asc" },
  { label: "Maior área", value: "area-desc" },
];
const initial = () => { const p = new URLSearchParams(location.search); return {
  operation: p.get("operacao") ?? p.get("tipo") ?? "todos", type: p.get("imovel") ?? "todos",
  bedrooms: Number(p.get("quartos") ?? 0), parking: Number(p.get("vagas") ?? 0),
  sort: (p.get("ordem") as SortOption | null) ?? "recent", reference: p.get("ref") ?? "",
}; };
const typeLabel = (value: string) => value.toLowerCase().replaceAll("_", " ").replace(/(^|\s)\S/g, c => c.toUpperCase());
const propertyUrl = (p: Property) => `/imoveis/${p.property_code ?? p.slug ?? p.id}`;
const price = (p: Property) => !p.price ? "Sob consulta" : `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(p.price)}${p.operation === "locacao" ? "/mês" : ""}`;

export default function Imoveis() {
  const start = useMemo(initial, []);
  const [properties, setProperties] = useState<Property[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState(false);
  const [operation, setOperation] = useState(start.operation), [kind, setKind] = useState(start.type);
  const [bedrooms, setBedrooms] = useState(start.bedrooms), [parking, setParking] = useState(start.parking);
  const [sort, setSort] = useState<SortOption>(start.sort), [reference, setReference] = useState(start.reference);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => { (async () => {
    setLoading(true); const result = await supabase.from("properties").select("*").eq("is_published", true);
    if (result.error) { console.error(result.error); setError(true); } else setProperties((result.data ?? []) as Property[]);
    setLoading(false);
  })(); }, []);

  useEffect(() => { const p = new URLSearchParams();
    if (operation !== "todos") p.set("operacao", operation); if (kind !== "todos") p.set("imovel", kind);
    if (bedrooms) p.set("quartos", String(bedrooms)); if (parking) p.set("vagas", String(parking));
    if (sort !== "recent") p.set("ordem", sort); if (reference.trim()) p.set("ref", reference.trim().toUpperCase());
    history.replaceState(null, "", `${location.pathname}${p.size ? `?${p}` : ""}`);
  }, [operation, kind, bedrooms, parking, sort, reference]);

  const types = useMemo(() => Array.from(new Set(properties.map(p => p.property_type).filter(Boolean) as string[])).sort(), [properties]);
  const hero = useMemo(() => { const eligible = properties.filter(p => p.cover_image && !heroExcludedPropertyCodes.has(p.property_code?.toUpperCase() ?? ""));
    const selected = eligible.filter(p => p.hero_enabled).sort((a,b) => (a.hero_order ?? 99) - (b.hero_order ?? 99)).slice(0,5);
    return selected.length ? selected : [...eligible].sort((a,b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0,5);
  }, [properties]);
  useEffect(() => { if (hero.length < 2) return; const id = setInterval(() => setHeroIndex(i => (i + 1) % hero.length), 10000); return () => clearInterval(id); }, [hero.length]);

  const visible = useMemo(() => properties.filter(p => operation === "todos" || p.operation === operation)
    .filter(p => kind === "todos" || p.property_type === kind).filter(p => !bedrooms || (p.bedrooms ?? 0) >= bedrooms)
    .filter(p => !parking || (p.parking_spots ?? 0) >= parking).filter(p => !reference.trim() || p.property_code?.toUpperCase().includes(reference.trim().toUpperCase()))
    .sort((a,b) => sort === "price-asc" ? (a.price ?? 1e15) - (b.price ?? 1e15) : sort === "price-desc" ? (b.price ?? 0) - (a.price ?? 0) : sort === "area-asc" ? (a.area ?? 1e15) - (b.area ?? 1e15) : sort === "area-desc" ? (b.area ?? 0) - (a.area ?? 0) : +new Date(b.created_at) - +new Date(a.created_at)), [properties, operation, kind, bedrooms, parking, sort, reference]);

  useEffect(() => { if (loading) return; const y = sessionStorage.getItem(`exact-scroll:${location.pathname}${location.search}`); if (y) requestAnimationFrame(() => scrollTo({ top: Number(y) })); }, [loading]);
  const remember = () => {
    const returnUrl = `${location.pathname}${location.search}`;
    sessionStorage.setItem("exact-properties-return", returnUrl);
    sessionStorage.setItem(`exact-scroll:${returnUrl}`, String(scrollY));
  };
  const clear = () => { setOperation("todos"); setKind("todos"); setBedrooms(0); setParking(0); setSort("recent"); setReference(""); };
  const filtered = operation !== "todos" || kind !== "todos" || bedrooms > 0 || parking > 0 || sort !== "recent" || !!reference.trim();
  const activeHero = hero[heroIndex];

  return <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <Header activePage="imoveis" />
    <section className="relative flex min-h-[650px] items-end overflow-hidden bg-black pt-20 md:min-h-[76vh]">
      <AnimatePresence mode="sync" initial={false}>{activeHero?.cover_image && <motion.img key={activeHero.id} src={activeHero.cover_image} alt="" aria-hidden loading={heroIndex ? "lazy" : "eager"} fetchPriority={heroIndex ? "auto" : "high"} decoding="async" className="absolute inset-0 h-full w-full object-cover" initial={{opacity:0,scale:1.025}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:2.4,ease:"easeInOut"}} />}</AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/20" />
      <div className="container relative z-10 mx-auto px-6 pb-16 md:pb-20">
        <p className="mb-5 text-[10px] uppercase tracking-[0.34em] text-white">Portfólio · Curitiba</p>
        <h1 className="mb-5 text-[44px] font-extralight leading-[.95] tracking-[-.035em] text-white md:text-[68px]">Nossos Imóveis</h1>
        <p className="max-w-xl text-sm leading-7 text-white md:text-[15px]">Uma seleção rigorosa de imóveis, escolhidos por arquitetura e localização.</p>
        {activeHero && <a href={propertyUrl(activeHero)} onClick={remember} className="mt-8 inline-flex items-center gap-5 text-[10px] uppercase tracking-[.2em] text-white hover:opacity-75"><span>{activeHero.property_code}</span><span className="h-px w-6 bg-white/70"/><span>{activeHero.title}</span></a>}
        {hero.length > 1 && <div className="absolute bottom-7 right-6 flex gap-3 md:bottom-10 md:right-10">{hero.map((p,i) => <button key={p.id} aria-label={`Exibir ${p.title}`} onClick={() => setHeroIndex(i)} className={`h-px transition-all ${i === heroIndex ? "w-10 bg-white" : "w-5 bg-white/45 hover:bg-white"}`} />)}</div>}
      </div>
    </section>

    <section className="sticky top-[57px] z-40 border-y border-white/10 bg-black/95 backdrop-blur-xl"><div className="container mx-auto px-6 py-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="grid grid-cols-3 gap-1 md:flex md:items-center md:gap-2">
          {[["todos","Todas as operações"],["locacao","Locação"],["aquisicao","Aquisição"]].map(([v,l]) => <button key={v} onClick={() => setOperation(v)} className={`shrink-0 border px-2 py-2 text-[9px] md:px-3 md:text-[10px] ${operation === v ? "border-white/45 text-white" : "border-transparent text-white/55"}`}>{l}</button>)}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <select aria-label="Tipo do imóvel" value={kind} onChange={e => setKind(e.target.value)} className="shrink-0 bg-black px-3 py-2 text-[10px] text-white/70"><option value="todos">Todos os imóveis</option>{types.map(t => <option key={t} value={t}>{typeLabel(t)}</option>)}</select>
        <select aria-label="Quartos" value={bedrooms} onChange={e => setBedrooms(+e.target.value)} className="shrink-0 bg-black px-3 py-2 text-[10px] text-white/70"><option value="0">Quartos</option>{[1,2,3,4].map(n => <option key={n} value={n}>{n}+ quartos</option>)}</select>
        <select aria-label="Vagas" value={parking} onChange={e => setParking(+e.target.value)} className="shrink-0 bg-black px-3 py-2 text-[10px] text-white/70"><option value="0">Vagas</option>{[1,2,3,4].map(n => <option key={n} value={n}>{n}+ vagas</option>)}</select>
        <div className="relative ml-auto shrink-0"><select aria-label="Ordenar" value={sort} onChange={e => setSort(e.target.value as SortOption)} className="appearance-none bg-black py-2 pl-3 pr-8 text-[10px] text-white/70">{sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select><ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/50"/></div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3"><div className="relative max-w-[230px] flex-1"><Search size={13} className="absolute left-1 top-1/2 -translate-y-1/2 text-white/45"/><input value={reference} onChange={e => setReference(e.target.value.toUpperCase())} placeholder="Buscar referência" className="w-full bg-transparent py-2 pl-7 text-[10px] uppercase tracking-[.12em] text-white outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-white/40"/></div><p className="ml-auto text-[9px] uppercase tracking-[.16em] text-white/45">{loading ? "Carregando" : `${visible.length} imóveis`}</p>{filtered && <button onClick={clear} className="flex items-center gap-1 text-[9px] uppercase tracking-[.14em] text-white/55 hover:text-white"><X size={11}/> Limpar</button>}</div>
    </div></section>

    <main className="container mx-auto px-6 py-16 md:py-20">{error ? <State text="Não foi possível carregar os imóveis agora." action="Tentar novamente" onClick={() => location.reload()}/> : loading ? <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="animate-pulse"><div className="aspect-[4/3] bg-white/[.06]"/><div className="mt-5 h-3 w-2/3 bg-white/[.06]"/></div>)}</div> : !visible.length ? <State text="Nenhum imóvel corresponde a esta busca." action="Limpar filtros" onClick={clear}/> : <motion.div layout className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">{visible.map(p => <motion.a layout key={p.id} href={propertyUrl(p)} onClick={remember} className="group block" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white/[.04]">{p.cover_image ? <img src={p.cover_image} alt={p.title ?? "Imóvel EXACT"} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"/> : <div className="flex h-full items-center justify-center text-xs text-white/35">Imagem em atualização</div>}{p.status && <span className="absolute right-3 top-3 bg-black/70 px-2.5 py-1 text-[9px] uppercase tracking-[.15em] text-white">{p.status}</span>}</div>
      <p className="mb-2 mt-5 text-[9px] uppercase tracking-[.17em] text-white/48">{p.operation === "locacao" ? "Locação" : "Aquisição"}</p><h2 className="text-[17px] font-light leading-snug text-white">{p.title}</h2><p className="mt-2 text-[11px] leading-5 text-white/55">{p.location}</p><p className="mt-4 text-sm text-white">{price(p)}</p>
      <div className="mt-5 grid grid-cols-4 border-t border-white/12 pt-4 text-[9px] uppercase tracking-[.1em] text-white/45"><Fact label="Quartos" value={p.bedrooms}/><Fact label="Vagas" value={p.parking_spots} icon/><Fact label="Área" value={p.area ? `${p.area} m²` : null}/><Fact label="Referência" value={p.property_code} right/></div>
    </motion.a>)}</motion.div>}</main>
    <footer className="border-t border-white/10 px-6 py-16"><div className="container mx-auto flex flex-col justify-between gap-8 text-xs text-white/55 md:flex-row"><div><p className="mb-3 tracking-[.18em] text-white">EXACT</p><p>Imóveis selecionados com precisão.</p></div><div className="flex gap-8"><a href={whatsappLink} target="_blank" rel="noreferrer">(41) 99972-3780</a><a href="mailto:contato@exactbr.com">contato@exactbr.com</a></div></div></footer>
  </div>;
}

function Fact({label,value,icon,right}:{label:string;value:string|number|null;icon?:boolean;right?:boolean}) { return <span className={right ? "text-right" : ""}><span className="inline-flex items-center gap-1">{label}{icon && <Car size={10}/>}</span><strong className="mt-1.5 block text-xs font-light normal-case text-white/85">{value ?? "—"}</strong></span>; }
function State({text,action,onClick}:{text:string;action:string;onClick:()=>void}) { return <div className="py-24 text-center"><p className="text-sm text-white/70">{text}</p><button onClick={onClick} className="mt-5 text-[10px] uppercase tracking-[.18em] text-white/50 hover:text-white">{action}</button></div>; }

