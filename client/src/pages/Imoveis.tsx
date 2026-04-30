import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

/**
 * EXACT - Página Imóveis
 * Design Philosophy: QUIET LUXURY
 * Portfólio exclusivo com filtros embutidos em uma única linha
 */

const propertyTypes = [
  "TODOS",
  "CASA",
  "CONDOMÍNIO",
  "COBERTURA",
  "APARTAMENTO",
  "LOFT",
  "STUDIO",
];

const statusOptions = [
  { label: "TODOS", value: "TODOS" },
  { label: "À VENDA", value: "À VENDA" },
];

const locations = [
  "TODOS",
  "Batel",
  "Champagnat",
  "Ecoville",
  "Água Verde",
  "Alto da XV",
  "Centro",
];

const properties = [
  {
    id: 1,
    type: "CASA",
    title: "Casa Moderna - Batel",
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
    type: "CONDOMÍNIO",
    title: "Apartamento Premium - Champagnat",
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
    type: "APARTAMENTO",
    title: "Apartamento Luxo - Água Verde",
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
    type: "COBERTURA",
    title: "Cobertura Duplex - Alto da XV",
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
    type: "LOFT",
    title: "Loft Industrial - Centro",
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
    type: "STUDIO",
    title: "Studio Compacto - Batel",
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
];

const sortOptions = [
  { label: "MAIS RECENTES", value: "recent" },
  { label: "PREÇO: MENOR", value: "price-asc" },
  { label: "PREÇO: MAIOR", value: "price-desc" },
  { label: "ÁREA: MENOR", value: "area-asc" },
  { label: "ÁREA: MAIOR", value: "area-desc" },
];

export default function Imoveis() {
  const [selectedType, setSelectedType] = useState("TODOS");
  const [selectedLocation, setSelectedLocation] = useState("TODOS");
  const [selectedStatus, setSelectedStatus] = useState("TODOS");
  const [sortBy, setSortBy] = useState("recent");

  const filteredProperties = properties
    .filter((p) => {
      const typeMatch = selectedType === "TODOS" || p.type === selectedType;
      const locationMatch =
        selectedLocation === "TODOS" || p.location.includes(selectedLocation);
      const statusMatch = selectedStatus === "TODOS" || p.status === selectedStatus;
      return typeMatch && locationMatch && statusMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "area-asc":
          return a.area - b.area;
        case "area-desc":
          return b.area - a.area;
        case "recent":
        default:
          return b.publishedDate.getTime() - a.publishedDate.getTime();
      }
    });

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-extralight tracking-normal cursor-pointer"
            style={{
              fontFamily: "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "0.15em",
              fontWeight: 300,
            }}
          >
            EXACT
          </motion.a>
          <div className="flex gap-10 items-center">
            <a
              href="/imoveis"
              className="text-xs font-light text-foreground transition-colors duration-300 tracking-wide"
            >
              Imóveis
            </a>
            <a
              href="/sobre"
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Sobre
            </a>
            <a
              href="/contato"
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Contato
            </a>
            <motion.a
              href="/contato"
              className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide border border-border/40 hover:border-border/60 px-4 py-2 rounded-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Atendimento Direto
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <section
        className="relative min-h-[60vh] flex items-center justify-start pt-20 overflow-hidden"
        style={{
          backgroundImage:
            "url(https://d2xsxph8kpxj0f.cloudfront.net/310519663481007953/48chfHstyxneY6QiBvkAHj/cityscape-background-MLhhLWwxT5jepc8AoTEKAL.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-light tracking-widest text-amber-600/80 mb-4">
              PORTFÓLIO EXCLUSIVO
            </p>
            <h1
              className="text-5xl md:text-6xl font-light mb-6 leading-tight tracking-tight"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Nossos Imóveis
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-light tracking-wide max-w-2xl">
              Uma seleção rigorosa dos melhores imóveis de alto padrão em Curitiba.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section - Single Row */}
      <section className="py-6 bg-background border-t border-border/20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            {/* Left Side: Type Filters */}
            <motion.div
              className="flex gap-0.5 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
            >
              {propertyTypes.map((type, index) => (
                <motion.button
                  key={type}
                  variants={itemVariants}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-1 text-xs font-light rounded-sm transition-all duration-300 tracking-wide border whitespace-nowrap ${
                    index === 0 && selectedType === type
                      ? "bg-amber-600/40 text-amber-600 border-amber-600/60"
                      : "border-border/40 text-foreground hover:border-border/60"
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </motion.div>

            {/* Right Side: Status, Location, Sort */}
            <motion.div
              className="flex gap-0.5 items-center ml-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.03 } } }}
            >
              {/* Status Filters */}
              {statusOptions.map((option) => (
                <motion.button
                  key={option.value}
                  variants={itemVariants}
                  onClick={() => setSelectedStatus(option.value)}
                  className="px-2.5 py-1 text-xs font-light rounded-sm transition-all duration-300 tracking-wide border border-border/40 text-foreground hover:border-border/60 whitespace-nowrap"
                >
                  {option.label}
                </motion.button>
              ))}

              {/* Location Dropdown */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 text-xs font-light bg-background border border-border/40 hover:border-border/60 rounded-sm text-foreground focus:outline-none focus:border-border/80 transition-all duration-300 cursor-pointer appearance-none pr-7 whitespace-nowrap"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-light bg-background border border-border/40 hover:border-border/60 rounded-sm text-foreground focus:outline-none focus:border-border/80 transition-all duration-300 cursor-pointer appearance-none pr-7 whitespace-nowrap"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Results Count */}
          <p className="text-xs text-muted-foreground font-light mt-4">
            {filteredProperties.length} IMÓVEIS ENCONTRADOS
          </p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid md:grid-cols-3 gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  className="group cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  {/* Card Container with Glow Effect */}
                  <div className="relative">
                    {/* Subtle Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/5 rounded-sm transition-all duration-500 pointer-events-none"></div>
                    
                    {/* Image */}
                    <div className="relative overflow-hidden mb-6 h-80 rounded-sm bg-muted/30 border border-border/20 group-hover:border-amber-500/30 transition-all duration-500 flex items-center justify-center shadow-lg group-hover:shadow-amber-500/10">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-sm">
                      <p className="text-xs font-light tracking-wide text-foreground">
                        {property.status}
                      </p>
                    </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 relative z-10">
                    <h3
                      className="text-lg font-light leading-tight tracking-tight"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {property.title}
                    </h3>

                    <p className="text-sm text-muted-foreground font-light">
                      {property.location}
                    </p>

                    <p className="text-base font-light tracking-wide">
                      {property.priceFormatted}
                    </p>

                    {/* Details */}
                    <div className="flex gap-6 pt-4 border-t border-border/20">
                      <div>
                        <p className="text-xs text-muted-foreground font-light mb-1">
                          Quartos
                        </p>
                        <p className="text-sm font-light">{property.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-light mb-1">
                          Banheiros
                        </p>
                        <p className="text-sm font-light">{property.bathrooms}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-light mb-1">
                          Área
                        </p>
                        <p className="text-sm font-light">{property.area}m²</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <a href={`/imoveis/${property.id}`}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 text-xs font-light tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 mt-4"
                      >
                        MAIS INFORMAÇÕES
                        <ChevronRight size={14} />
                      </motion.div>
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20">
                <p className="text-sm text-muted-foreground font-light">
                  Nenhum imóvel encontrado com os filtros selecionados.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/20 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4
                className="text-xs font-light tracking-widest mb-6"
                style={{
                  fontFamily:
                    "'SF Pro Rounded', -apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: "0.15em",
                }}
              >
                EXACT
              </h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Curadoria imobiliária com análise precisa.
              </p>
            </div>
            <div>
              <p className="text-xs font-light tracking-widest mb-4">Navegação</p>
              <div className="space-y-2">
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
              <p className="text-xs font-light tracking-widest mb-4">Contato</p>
              <div className="space-y-2">
                <a
                  href="tel:+5541997683715"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  (41) 99768-3715
                </a>
                <a
                  href="mailto:contato@exact.com.br"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors font-light block"
                >
                  contato@exact.com.br
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/20 pt-8">
            <p className="text-xs text-muted-foreground font-light text-center">
              © 2026 EXACT. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
