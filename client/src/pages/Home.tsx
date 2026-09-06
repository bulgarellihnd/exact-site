import {
  ArrowRight,
  Mail,
  MapPinIcon,
  Phone,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const whatsappLink =
  "https://wa.me/5541999723780?text=Ol%C3%A1.%20Tenho%20interesse%20em%20um%20im%C3%B3vel%20da%20EXACT%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

const heroImages = {
  light: "/images/exact-home-day.webp",
  dark: "/images/exact-home-night.webp",
} as const;

const exactLogoStyle = {
  fontFamily: "'Raleway', sans-serif",
  fontSize: "1.28rem",
  fontWeight: 360,
  letterSpacing: "0.11em",
  lineHeight: 1,
};

type HighlightProperty = {
  id: number;
  property_code: string | null;
  title: string | null;
  property_type: string | null;
  operation: string | null;
  price: number | null;
  location: string | null;
  cover_image: string | null;
};

function formatPrice(price: number | null) {
  if (!price) return "Sob consulta";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const savedTheme = window.localStorage.getItem("exact-theme-v2");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return "dark";
  });
  const [searchCode, setSearchCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [highlights, setHighlights] = useState<HighlightProperty[]>([]);
  const [rentalImages, setRentalImages] = useState<string[]>([]);
  const [acquisitionImages, setAcquisitionImages] = useState<string[]>([]);
  const [rentalImageIndex, setRentalImageIndex] = useState(0);
  const [acquisitionImageIndex, setAcquisitionImageIndex] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.localStorage.setItem("exact-theme-v2", theme);
  }, [theme]);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: "easeOut" },
    },
  };

  useEffect(() => {
    async function loadHomeProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, property_code, title, property_type, operation, price, location, cover_image"
        )
        .eq("is_published", true)
        .not("cover_image", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar imóveis da Home:", error);
        return;
      }

      const properties = (data ?? []) as HighlightProperty[];

      const normalizeOperation = (value: string | null) =>
        (value ?? "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      const byPrice = (left: HighlightProperty, right: HighlightProperty) =>
        (right.price ?? 0) - (left.price ?? 0);

      const rentals = properties
        .filter((property) => normalizeOperation(property.operation) === "locacao")
        .sort(byPrice);

      const acquisitions = properties
        .filter((property) => normalizeOperation(property.operation) === "aquisicao")
        .sort(byPrice);

      const editorialHighlights = Array.from({ length: 3 }).flatMap((_, index) =>
        [acquisitions[index], rentals[index]].filter(
          (property): property is HighlightProperty => Boolean(property)
        )
      );

      setHighlights(editorialHighlights.slice(0, 6));

      const rentalCovers = rentals
        .map((property) => property.cover_image)
        .filter((image): image is string => Boolean(image));

      const acquisitionCovers = acquisitions
        .map((property) => property.cover_image)
        .filter((image): image is string => Boolean(image));

      setRentalImages(rentalCovers);
      setAcquisitionImages(acquisitionCovers);
    }

    loadHomeProperties();
  }, []);

  useEffect(() => {
    if (rentalImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setRentalImageIndex((index) => (index + 1) % rentalImages.length);
    }, 9500);

    return () => window.clearInterval(interval);
  }, [rentalImages]);

  useEffect(() => {
    if (acquisitionImages.length <= 1) return;

    const interval = window.setInterval(() => {
      setAcquisitionImageIndex(
        (index) => (index + 1) % acquisitionImages.length
      );
    }, 10200);

    return () => window.clearInterval(interval);
  }, [acquisitionImages]);

  async function handleSearch() {
    const code = searchCode.trim().toUpperCase();

    if (!code) {
      toast.error("Digite um código para buscar");
      return;
    }

    setIsSearching(true);

    const { data, error } = await supabase
      .from("properties")
      .select("property_code")
      .eq("property_code", code)
      .eq("is_published", true)
      .maybeSingle();

    setIsSearching(false);

    if (error || !data?.property_code) {
      toast.error(`Imóvel com código "${code}" não encontrado`);
      return;
    }

    setSearchCode("");
    setLocation(`/imoveis/${data.property_code}`);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-colors duration-700 ${
        theme === "light" ? "home-light" : "home-dark"
      }`}
    >
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="relative flex w-full items-center justify-between px-5 py-4 md:px-6">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-white"
            style={exactLogoStyle}
            onClick={() => setLocation("/")}
          >
            EXACT
          </motion.button>

          <div className="flex items-center gap-4 pr-14 md:gap-10 md:pr-16">
            <a
              href="/imoveis"
              className="text-xs font-light tracking-wide text-white/88 transition-colors duration-300 hover:text-white"
            >
              Imóveis
            </a>
            <a
              href="/sobre"
              className="text-xs font-light tracking-wide text-white/88 transition-colors duration-300 hover:text-white"
            >
              Sobre
            </a>
            <a
              href="/contato"
              className="text-xs font-light tracking-wide text-white/88 transition-colors duration-300 hover:text-white"
            >
              Contato
            </a>
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-sm border border-white/25 px-4 py-2 text-xs font-light tracking-wide text-white/95 transition-all duration-300 hover:border-white/50 hover:text-white md:inline-flex"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              Atendimento Direto
            </motion.a>
            <motion.button
              type="button"
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              title={theme === "dark" ? "Tema claro" : "Tema escuro"}
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              className="absolute right-5 top-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-white/55 hover:bg-white/10 md:right-6"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -25, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 25, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.img
            key={theme}
            src={heroImages[theme]}
            alt="Interior residencial contemporâneo com vista para Curitiba"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.8 }, scale: { duration: 8, ease: "easeOut" } }}
          />
        </AnimatePresence>

        <motion.div
          className="absolute inset-0 bg-black"
          animate={{ opacity: theme === "dark" ? 0.28 : 0.26 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/28 via-black/10 to-black/52" />

        <motion.div
          className="relative z-10 h-screen w-full px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
        >
          <div className="absolute left-1/2 top-[40%] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 px-6">
            <motion.p
              className="mb-6 text-[10px] font-light uppercase tracking-[0.34em] text-white/82"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              EXACT Imóveis · Curitiba
            </motion.p>

            <motion.h1
              className="text-[38px] font-extralight tracking-[-0.03em] text-[#F4F4F4] md:text-[58px]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Só o que importa.
            </motion.h1>
          </div>

          <motion.div
            className="absolute bottom-[11%] left-1/2 ml-[7px] flex -translate-x-1/2 flex-wrap justify-center gap-4 px-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <a
              href="/imoveis"
              className="inline-flex min-w-[168px] items-center justify-center rounded-sm bg-[#F2F2F2] px-6 py-3.5 text-[11px] font-normal uppercase tracking-[0.2em] text-[#111111] transition-all duration-300 hover:-translate-y-px hover:bg-white"
            >
              Ver imóveis
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[168px] items-center justify-center rounded-sm border border-white/30 px-6 py-3.5 text-[11px] font-light uppercase tracking-[0.2em] text-white/90 transition-all duration-300 hover:-translate-y-px hover:border-white/60 hover:bg-white/[0.04] hover:text-white"
            >
              Falar com a EXACT
            </a>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-20 bg-background py-24 transition-colors duration-700 md:py-28">
        <div className="container mx-auto px-6">
          <motion.div
            className="mx-auto max-w-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h2 className="text-2xl font-extralight tracking-tight md:text-3xl">
                Encontre um imóvel pelo código
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ex.: EX0011"
                  value={searchCode}
                  onChange={(event) => setSearchCode(event.target.value)}
                  onKeyDown={handleKeyPress}
                  aria-label="Código de referência do imóvel"
                  className="w-full rounded-sm border border-border bg-background/50 px-4 py-4 pr-12 text-sm font-light uppercase tracking-[0.08em] text-foreground placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus:border-foreground/45 focus:outline-none"
                />
                <Search
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>

              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSearch}
                disabled={isSearching}
                className="min-w-[104px] rounded-sm bg-foreground px-5 py-4 text-xs font-normal tracking-wide text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[120px] sm:px-6"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>


      <section className="bg-background pb-20 pt-28 md:pb-28 md:pt-40">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid gap-12 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.a
              href="/imoveis?tipo=locacao"
              variants={itemVariants}
              className="group block"
              whileHover={{ y: -3 }}
            >
              <h3 className="mb-5 text-2xl font-extralight tracking-tight">
                Locação
              </h3>
              <div className="relative mb-6 h-[360px] overflow-hidden rounded-sm bg-muted/30 md:h-[500px]">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={rentalImages[rentalImageIndex] ?? heroImages[theme]}
                    src={rentalImages[rentalImageIndex] ?? heroImages[theme]}
                    alt="Imóvel disponível para locação"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.8, ease: "easeInOut" }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    Imóveis selecionados para viver com conforto e localização.
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="mb-1 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
                />
              </div>
            </motion.a>

            <motion.a
              href="/imoveis?tipo=aquisicao"
              variants={itemVariants}
              className="group block"
              whileHover={{ y: -3 }}
            >
              <h3 className="mb-5 text-right text-2xl font-extralight tracking-tight">
                Aquisição
              </h3>
              <div className="relative mb-6 h-[360px] overflow-hidden rounded-sm bg-muted/30 md:h-[500px]">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={acquisitionImages[acquisitionImageIndex] ?? heroImages[theme]}
                    src={acquisitionImages[acquisitionImageIndex] ?? heroImages[theme]}
                    alt="Imóvel disponível para aquisição"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.8, ease: "easeInOut" }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    Uma seleção criteriosa de imóveis para chamar de seu.
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="mb-1 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
                />
              </div>
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-14 flex justify-center md:mt-18"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <a
              href="/imoveis"
              className="group inline-flex items-center gap-4 border-b border-border pb-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              Ver todos os imóveis
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>
      </section>

      {highlights.length > 0 && (
        <>
        <section className="sticky top-0 z-10 flex min-h-[100svh] items-center bg-card pb-[220px] pt-14 transition-colors duration-700 md:pb-[228px] md:pt-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div
                variants={itemVariants}
                className="mb-12 flex items-end justify-between gap-6 md:mb-16"
              >
                <div>
                  <p className="text-[11px] font-light uppercase tracking-[0.32em] text-muted-foreground">
                    Seleção
                  </p>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                  <button
                    type="button"
                    aria-label="Ver imóveis anteriores"
                    onClick={() =>
                      document
                        .getElementById("selection-carousel")
                        ?.scrollBy({
                          left: -window.innerWidth * 0.8,
                          behavior: "smooth",
                        })
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/30 text-sm text-muted-foreground transition-colors hover:border-border/60 hover:text-foreground"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    aria-label="Ver próximos imóveis"
                    onClick={() =>
                      document
                        .getElementById("selection-carousel")
                        ?.scrollBy({
                          left: window.innerWidth * 0.8,
                          behavior: "smooth",
                        })
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/30 text-sm text-muted-foreground transition-colors hover:border-border/60 hover:text-foreground"
                  >
                    →
                  </button>
                </div>
              </motion.div>

              <div
                id="selection-carousel"
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] md:gap-10 [&::-webkit-scrollbar]:hidden"
              >
                {highlights.map((property) => (
                  <motion.a
                    key={property.id}
                    href={`/imoveis/${property.property_code ?? property.id}`}
                    variants={itemVariants}
                    className="group block min-w-[86%] shrink-0 snap-start sm:min-w-[62%] md:min-w-[calc(33.333%-1.7rem)]"
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative mb-5 h-[40svh] min-h-[260px] max-h-[360px] overflow-hidden rounded-sm bg-muted/20">
                      <img
                        src={property.cover_image ?? ""}
                        alt={property.title ?? "Imóvel EXACT"}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

                      <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                        {property.operation === "locacao" ? "Locação" : "Aquisição"}
                      </span>

                      {property.property_code && (
                        <span className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.18em] text-white/90">
                          {property.property_code}
                        </span>
                      )}

                      <span className="absolute bottom-4 right-4 text-sm font-light text-white">
                        {formatPrice(property.price)}
                      </span>
                    </div>

                    <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {property.property_type ?? "Imóvel"}
                    </p>

                    <h3 className="mb-2 line-clamp-2 text-xl font-light leading-snug tracking-tight">
                      {property.title ?? "Imóvel EXACT"}
                    </h3>

                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {property.location ?? "Curitiba"}
                    </p>

                    <div className="flex items-center justify-end pt-1">
                      <ArrowRight
                        size={15}
                        className="text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground"
                      />
                    </div>
                  </motion.a>
                ))}
              </div>

            </motion.div>
          </div>
        </section>
        </>
      )}

      <footer
        id="contact"
        className="relative z-20 rounded-t-[28px] border-t border-border/20 bg-background py-24 transition-colors duration-700 md:rounded-t-[36px]"
      >
        <div className="container mx-auto px-6">
          <div className="mb-20 grid gap-16 md:grid-cols-4">
            <div>
              <h3 className="mb-5 text-foreground" style={exactLogoStyle}>
                EXACT
              </h3>
              <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                Imóveis selecionados com precisão.
              </p>
            </div>

            <div>
              <h4 className="mb-5 text-xs font-light tracking-wide text-muted-foreground">
                Navegação
              </h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li>
                  <a
                    href="/imoveis"
                    className="transition-colors hover:text-foreground"
                  >
                    Imóveis
                  </a>
                </li>
                <li>
                  <a
                    href="/sobre"
                    className="transition-colors hover:text-foreground"
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    href="/contato"
                    className="transition-colors hover:text-foreground"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-xs font-light tracking-wide text-muted-foreground">
                Contato
              </h4>
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone size={12} />
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    (41) 99972-3780
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={12} />
                  <a
                    href="mailto:contato@exactbr.com"
                    className="transition-colors hover:text-foreground"
                  >
                    contato@exactbr.com
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-xs font-light tracking-wide text-muted-foreground">
                Localização
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPinIcon size={12} />
                <span>Curitiba, PR</span>
              </div>
            </div>
          </div>

          <div className="border-t border-border/20 pt-12 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 EXACT. Todos os direitos reservados.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <a
                href="/politica-de-privacidade"
                className="transition-colors duration-300 hover:text-foreground"
              >
                Política de Privacidade
              </a>
              <span>·</span>
              <a
                href="/termos-de-uso"
                className="transition-colors duration-300 hover:text-foreground"
              >
                Termos de Uso
              </a>
            </div>

            <div className="mt-6 space-y-1 text-[11px] text-muted-foreground">
              <p>EXACT Imóveis</p>
              <p>CNPJ 66.285.005/0001-16</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

