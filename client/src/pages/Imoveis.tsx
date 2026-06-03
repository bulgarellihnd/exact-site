import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

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

const properties = [
  {
    id: 1,
    operation: "aquisicao",
    type: "CASA",
    title: "Casa Moderna — Batel",
    price: 2500000,
    priceFormatted: "R$ 2.5M",
    location: "Batel, Curitiba",
    bedrooms: 4,
    bathrooms: 3,
    area: 450,
    status: "EXCLUSIVO",
    publishedDate: new Date(2026, 3, 1),
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/luxury-house-1-mopBBySW8y75dRzLpigHy9.webp",
  },
  {
    id: 2,
    operation: "aquisicao",
    type: "CONDOMÍNIO",
    title: "Apartamento Premium — Champagnat",
    price: 1800000,
    priceFormatted: "R$ 1.8M",
    location: "Champagnat, Curitiba",
    bedrooms: 3,
    bathrooms: 2,
    area: 320,
    status: "À VENDA",
    publishedDate: new Date(2026, 2, 15),
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/luxury-apartment-1-bzVZhh6D7gyxAkVbYqMeTH.webp",
  },
  {
    id: 3,
    operation: "aquisicao",
    type: "APARTAMENTO",
    title: "Apartamento Luxo — Água Verde",
    price: 1200000,
    priceFormatted: "R$ 1.2M",
    location: "Água Verde, Curitiba",
    bedrooms: 3,
    bathrooms: 2,
    area: 280,
    status: "À VENDA",
    publishedDate: new Date(2026, 2, 20),
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/luxury-apartment-2-dfi8bomayub4DHDCgMTZ53.webp",
  },
  {
    id: 4,
    operation: "aquisicao",
    type: "COBERTURA",
    title: "Cobertura Duplex — Alto da XV",
    price: 3200000,
    priceFormatted: "R$ 3.2M",
    location: "Alto da XV, Curitiba",
    bedrooms: 4,
    bathrooms: 3,
    area: 520,
    status: "NOVO",
    publishedDate: new Date(2026, 3, 5),
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/luxury-apartment-1-bzVZhh6D7gyxAkVbYqMeTH.webp",
  },
  {
    id: 5,
    operation: "aquisicao",
    type: "LOFT",
    title: "Loft Industrial — Centro",
    price: 950000,
    priceFormatted: "R$ 950K",
    location: "Centro, Curitiba",
    bedrooms: 2,
    bathrooms: 1,
    area: 180,
    status: "À VENDA",
    publishedDate: new Date(2026, 1, 28),
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/luxury-apartment-2-dfi8bomayub4DHDCgMTZ53.webp",
  },
  {
    id: 6,
    operation: "aquisicao",
    type: "STUDIO",
    title: "Studio Compacto — Batel",
    price: 450000,
    priceFormatted: "R$ 450K",
    location: "Batel, Curitiba",
    bedrooms: 1,
    bathrooms: 1,
    area: 65,
    status: "À VENDA",
    publishedDate: new Date(2026, 0, 10),
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/luxury-apartment-1-bzVZhh6D7gyxAkVbYqMeTH.webp",
  },
  {
    id: 7,
    operation: "aquisicao",
    type: "APARTAMENTO",
    title: "Apartamento Alto Padrão — Batel",
    price: 1850000,
    priceFormatted: "R$ 1.85M",
    location: "Batel, Curitiba",
    bedrooms: 3,
    bathrooms: 2,
    area: 210,
    status: "À VENDA",
    publishedDate: new Date(2026, 4, 1),
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
];

export default function Imoveis() {
  const [selectedOperation, setSelectedOperation] = useState("TODOS");
  const [selectedType, setSelectedType] = useState("TODOS");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo");
    if (tipo === "locacao" || tipo === "aquisicao") {
      setSelectedOperation(tipo);
    }
  }, []);

  const filteredProperties = properties
    .filter((p) => {
      const operationMatch = selectedOperation === "TODOS" || p.operation === selectedOperation;
      const typeMatch = selectedType === "TODOS" || p.type === selectedType;
      return operationMatch && typeMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "area-asc": return a.area - b.area;
        case "area-desc": return b.area - a.area;
        default: return b.publishedDate.getTime() - a.publishedDate.getTime();
      }
    });

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const whatsappLink =
    "https://wa.me/5541999723780?text=Ol%C3%A1.%20Tenho%20interesse%20em%20um%20im%C3%B3vel%20da%20EXACT%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAV */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-border/15">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.18em] font-light cursor-pointer"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            EXACT
          </motion.a>
          <div className="flex gap-10 items-center">
            <a href="/imoveis" className="text-xs font-light text-foreground tracking-wide border-b border-foreground/40 pb-px">
              Imóveis
            </a>
            <a href="/sobre" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
              Sobre
            </a>
            <a href="/contato" className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide">
              Contato
            </a>
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide border border-border/40 hover:border-border/60 px-4 py-2 rounded-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Atendimento Direto
            </motion.a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative min-h-[55vh] flex items-end justify-start pt-20 overflow-hidden"
        style={{
          backgroundImage: "url(https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/cityscape-background-MLhhLWwxT5jepc8AoTEKAL.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="container mx-auto px-6 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-light tracking-[0.28em] text-amber-500/70 uppercase mb-4">
              Portfólio Exclusivo
            </p>
            <h1 className="text-[42px] md:text-[56px] font-extralight mb-4 leading-none tracking-tight text-white/90">
              Nossos Imóveis
            </h1>
            <p className="text-sm text-white/50 font-light tracking-wide max-w-lg">
              Uma seleção rigorosa dos melhores imóveis de alto padrão em Curitiba.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTROS */}
      <section className="py-5 bg-background border-t border-border/15 sticky top-[57px] z-40">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-8 flex-wrap">

            {/* Grupo 1 — Operação */}
            <div className="flex items-center gap-1">
              {operationOptions.map((option) => (
                <button
                  key={option.value}
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

            {/* Divisor */}
            <div className="w-px h-4 bg-border/30 shrink-0" />

            {/* Grupo 2 — Tipo */}
            <div className="flex items-center gap-1 flex-wrap">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
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

            {/* Divisor */}
            <div className="w-px h-4 bg-border/30 shrink-0" />

            {/* Ordenação */}
            <div className="ml-auto relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-1.5 text-[11px] font-light bg-transparent border border-border/30 hover:border-border/50 rounded-sm text-muted-foreground hover:text-foreground focus:outline-none transition-all duration-200 cursor-pointer appearance-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-background">
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/50 font-light mt-3 tracking-widest uppercase">
            {filteredProperties.length} imóveis encontrados
          </p>
        </div>
      </section>

      {/* GRID DE IMÓVEIS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-3 gap-x-10 gap-y-16"
            initial="hidden"
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
                  <a href={`/imoveis/${property.id}`} className="block">
                    <div className="relative overflow-hidden mb-5 h-72 rounded-sm bg-muted/20 border border-border/15 group-hover:border-border/35 transition-all duration-500">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-background/75 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                        <p className="text-[10px] font-light tracking-widest text-foreground/80 uppercase">
                          {property.status}
                        </p>
                      </div>
                    </div>
                  </a>

                  <div className="space-y-2">
                    <a href={`/imoveis/${property.id}`}>
                      <h3 className="text-base font-light leading-tight tracking-tight hover:text-muted-foreground transition-colors duration-300">
                        {property.title}
                      </h3>
                    </a>

                    <p className="text-xs text-muted-foreground font-light">
                      {property.location}
                    </p>

                    <p className="text-sm font-light tracking-wide pt-1">
                      {property.priceFormatted}
                    </p>

                    <div className="flex gap-6 pt-4 border-t border-border/15">
                      <div>
                        <p className="text-[10px] text-muted-foreground/60 font-light mb-1 uppercase tracking-wider">Quartos</p>
                        <p className="text-xs font-light">{property.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/60 font-light mb-1 uppercase tracking-wider">Banheiros</p>
                        <p className="text-xs font-light">{property.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground/60 font-light mb-1 uppercase tracking-wider">Área</p>
                        <p className="text-xs font-light">{property.area}m²</p>
                      </div>
                    </div>

                    <a href={`/imoveis/${property.id}`}>
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

      {/* FOOTER */}
      <footer className="bg-background border-t border-border/15 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-16">
            <div>
              <h4 className="text-xs font-light tracking-[0.18em] mb-6">EXACT</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Curadoria imobiliária com análise precisa.
              </p>
            </div>
            <div>
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">Navegação</p>
              <div className="space-y-3">
                <a href="/imoveis" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block">Imóveis</a>
                <a href="/sobre" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block">Sobre</a>
                <a href="/contato" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block">Contato</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">Contato</p>
              <div className="space-y-3">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block">
                  (41) 99972-3780
                </a>
                <a href="mailto:contato@exactbr.com" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block">
                  contato@exactbr.com
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-light tracking-wide text-muted-foreground mb-5">Localização</p>
              <p className="text-xs text-muted-foreground font-light">Curitiba, PR</p>
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
