import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

const operationOptions = [
  { label: "Todos", value: "TODOS" },
  { label: "Locação", value: "locacao" },
  { label: "Aquisição", value: "aquisicao" },
];

const propertyTypes = [
  { label: "Todos", value: "TODOS" },
  { label: "Casa", value: "CASA" },
  { label: "Condomínio", value: "CONDOMÍNIO" },
  { label: "Cobertura", value: "COBERTURA" },
  { label: "Apartamento", value: "APARTAMENTO" },
  { label: "Loft", value: "LOFT" },
  { label: "Studio", value: "STUDIO" },
];

const sortOptions = [
  { label: "Mais recentes", value: "recent" },
  { label: "Preço: menor", value: "price-asc" },
  { label: "Preço: maior", value: "price-desc" },
  { label: "Área: menor", value: "area-asc" },
  { label: "Área: maior", value: "area-desc" },
];

const fallbackHeroImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=88";

type Property = {
  id: number;
  property_code: string | null;
  created_at: string;
  title: string | null;
  slug: string | null;
  operation: string | null;
  property_type: string | null;
  price: number | null;
  location: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  status: string | null;
  description: string | null;
  cover_image: string | null;
  is_published: boolean | null;
};

function formatPrice(price: number | null) {
  if (!price) return "Sob consulta";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

function getPropertyUrl(property: Property) {
  return `/imoveis/${property.property_code ?? property.slug ?? property.id}`;
}

export default function Imoveis() {
  const [selectedOperation, setSelectedOperation] = useState("TODOS");
  const [selectedType, setSelectedType] = useState("TODOS");
  const [sortBy, setSortBy] = useState("recent");
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_published", true);

      if (error) {
        console.error("Erro Supabase properties:", error);
        return;
      }

      setProperties(data ?? []);
    }

    loadProperties();

    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo");

    if (tipo === "locacao" || tipo === "aquisicao") {
      setSelectedOperation(tipo);
    }
  }, []);

  const filteredProperties = properties
    .filter((property) => {
      const operationMatch =
        selectedOperation === "TODOS" || property.operation === selectedOperation;

      const typeMatch =
        selectedType === "TODOS" || property.property_type === selectedType;

      return operationMatch && typeMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price ?? 0) - (b.price ?? 0);
        case "price-desc":
          return (b.price ?? 0) - (a.price ?? 0);
        case "area-asc":
          return (a.area ?? 0) - (b.area ?? 0);
        case "area-desc":
          return (b.area ?? 0) - (a.area ?? 0);
        default:
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
      }
    });

  const heroImage =
    [...properties]
      .filter((property) => Boolean(property.cover_image))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )[0]?.cover_image ?? fallbackHeroImage;

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const whatsappLink =
    "https://wa.me/5541999723780?text=Ol%C3%A1.%20Tenho%20interesse%20em%20um%20im%C3%B3vel%20da%20EXACT%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activePage="imoveis" />

      <section className="relative flex min-h-[68vh] items-end justify-start overflow-hidden pt-20 md:min-h-[74vh]">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/28 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/32 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-6 pb-20 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="max-w-2xl"
          >
        

            <h1 className="mb-5 text-[44px] font-extralight leading-[0.95] tracking-[-0.025em] text-white md:text-[64px]">
              Nossos Imóveis
            </h1>

            <p className="max-w-xl text-sm font-light leading-6 tracking-wide text-white/66 md:text-[15px]">
  Uma seleção rigorosa de imóveis, escolhidos por arquitetura e localização.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-5 bg-background border-t border-border/15 sticky top-[57px] z-40">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-1">
              {operationOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedOperation(option.value)}
                  className={`px-3 py-1.5 text-[11px] font-light rounded-sm transition-all duration-200 tracking-wide border ${
                    selectedOperation === option.value
                      ? "bg-foreground/8 text-foreground border-foreground/25"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/30"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-border/30 shrink-0" />

            <div className="flex items-center gap-1 flex-wrap">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`px-3 py-1.5 text-[11px] font-light rounded-sm transition-all duration-200 tracking-wide border ${
                    selectedType === type.value
                      ? "bg-foreground/8 text-foreground border-foreground/25"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/30"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-border/30 shrink-0" />

            <div className="ml-auto relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="pl-3 pr-8 py-1.5 text-[11px] font-light bg-transparent border border-border/30 hover:border-border/50 rounded-sm text-muted-foreground hover:text-foreground focus:outline-none transition-all duration-200 cursor-pointer appearance-none"
              >
                {sortOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-background"
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/50 font-light mt-3 tracking-widest uppercase">
            {filteredProperties.length} imóveis encontrados
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-3 gap-x-10 gap-y-16"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  className="group"
                  whileHover={{ y: -3 }}
                >
                  <a href={getPropertyUrl(property)} className="block">
                    <div className="relative overflow-hidden mb-5 h-72 rounded-sm bg-muted/20 border border-border/15 group-hover:border-border/35 transition-all duration-500">
                      {property.cover_image ? (
                        <img
                          src={property.cover_image}
                          alt={property.title ?? "Imóvel EXACT"}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          Sem imagem
                        </div>
                      )}

                      {property.status && (
                        <div className="absolute top-3 right-3 bg-background/75 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                          <p className="text-[10px] font-light tracking-widest text-foreground/80 uppercase">
                            {property.status}
                          </p>
                        </div>
                      )}
                    </div>
                  </a>

                  <div className="space-y-2">
  <a href={getPropertyUrl(property)}>
    <h3 className="text-base font-light leading-tight tracking-tight hover:text-muted-foreground transition-colors duration-300">
      {property.title}
    </h3>
  </a>

  <p className="text-xs text-muted-foreground font-light">
    {property.location}
  </p>

  <p className="text-sm font-light tracking-wide pt-1">
    {formatPrice(property.price)}
  </p>

  <div className="flex items-start pt-4 border-t border-border/15">
    <div className="mr-6">
      <p className="text-[10px] text-muted-foreground/60 font-light mb-1 uppercase tracking-wider">
        Quartos
      </p>
      <p className="text-xs font-light">
        {property.bedrooms ?? "-"}
      </p>
    </div>

    <div className="mr-6">
      <p className="text-[10px] text-muted-foreground/60 font-light mb-1 uppercase tracking-wider">
        Banheiros
      </p>
      <p className="text-xs font-light">
        {property.bathrooms ?? "-"}
      </p>
    </div>

    <div>
      <p className="text-[10px] text-muted-foreground/60 font-light mb-1 uppercase tracking-wider">
        Área
      </p>
      <p className="text-xs font-light">
        {property.area ? `${property.area}m²` : "-"}
      </p>
    </div>

    <div className="ml-auto text-right">
      <p className="text-[10px] text-muted-foreground/60 font-light mb-1 uppercase tracking-wider">
        Ref
      </p>
      <p className="text-xs font-light">
        {property.property_code ?? "-"}
      </p>
    </div>
  </div>

  <a href={getPropertyUrl(property)}>
    <div className="flex items-center gap-1.5 text-[10px] font-light tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors duration-300 mt-4 uppercase">
      Mais informações
      <ChevronRight size={12} />
    </div>
  </a>
</div>
</motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-24">
                <p className="text-xs text-muted-foreground font-light tracking-wide">
                  Nenhum imóvel encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="bg-background border-t border-border/15 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div>
              <h4 className="text-xs font-light tracking-[0.18em] mb-6">
                EXACT
              </h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Curadoria imobiliária com análise precisa.
              </p>
            </div>

            <div>
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">
                Navegação
              </p>
              <div className="space-y-3">
                <a
                  href="/imoveis"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  Imóveis
                </a>
                <a
                  href="/sobre"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  Sobre
                </a>
                <a
                  href="/contato"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  Contato
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">
                Contato
              </p>
              <div className="space-y-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  (41) 99972-3780
                </a>
                <a
                  href="mailto:contato@exactbr.com"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  contato@exactbr.com
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">
                Localização
              </p>
              <p className="text-xs text-muted-foreground font-light">
                Curitiba, PR
              </p>
            </div>
          </div>

          <div className="border-t border-border/15 pt-8">
            <p className="text-xs text-muted-foreground font-light text-center">
              © 2026 EXACT. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}