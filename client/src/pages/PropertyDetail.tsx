import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Car,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ShareButtons from "@/components/ShareButtons";

type Property = {
  id: number;
  property_code: string | null;
  title: string | null;
  slug: string | null;
  operation: string | null;
  property_type: string | null;
  location: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spots: number | null;
  area: number | null;
  status: string | null;
  description: string | null;
  cover_image: string | null;
  is_published: boolean | null;
};

type PropertyImage = {
  id: number;
  image_url: string | null;
  sort_order: number | null;
  is_cover: boolean | null;
};

export default function PropertyDetail() {
  const [, params] = useRoute("/imoveis/:id");

  const [property, setProperty] = useState<Property | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);
  const thumbnailButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  const currentImage = gallery[currentImageIndex];

  useEffect(() => {
    async function loadProperty() {
      const identifier = params?.id;

      if (!identifier) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      let query = supabase
        .from("properties")
        .select(
          "id, property_code, title, slug, operation, property_type, location, price, bedrooms, bathrooms, parking_spots, area, status, description, cover_image, is_published"
        )
        .eq("is_published", true);

      query = query.eq("property_code", identifier.toUpperCase());

      const { data: propertyData, error: propertyError } = await query.single();

      if (propertyError || !propertyData) {
        console.error("Erro ao carregar imóvel:", propertyError);
        setProperty(null);
        setGallery([]);
        setIsLoading(false);
        return;
      }

      const { data: imageData, error: imageError } = await supabase
        .from("property_images")
        .select("id, image_url, sort_order, is_cover")
        .eq("property_id", propertyData.id)
        .order("sort_order", { ascending: true });

      if (imageError) {
        console.error("Erro ao carregar imagens:", imageError);
      }

      const images =
        imageData
          ?.map((image: PropertyImage) => image.image_url)
          .filter((imageUrl): imageUrl is string => Boolean(imageUrl)) ?? [];

      const finalGallery =
        images.length > 0
          ? images
          : propertyData.cover_image
            ? [propertyData.cover_image]
            : [];

      setProperty(propertyData);
      setGallery(finalGallery);
      setCurrentImageIndex(0);
      setIsLightboxOpen(false);
      setIsLoading(false);
    }

    loadProperty();
  }, [params?.id]);

  useEffect(() => {
    function handleKeyboardNavigation(event: KeyboardEvent) {
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
      if (event.key === "Escape") setIsLightboxOpen(false);
    }

    window.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [gallery.length]);

  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);


  useEffect(() => {
    if (gallery.length <= 1) return;

    const nextIndex = (currentImageIndex + 1) % gallery.length;
    const previousIndex =
      (currentImageIndex - 1 + gallery.length) % gallery.length;

    const urlsToPreload = [gallery[nextIndex], gallery[previousIndex]].filter(
      (url): url is string => Boolean(url)
    );

    const timeoutId = window.setTimeout(() => {
      urlsToPreload.forEach((url) => {
        if (preloadedImagesRef.current.has(url)) return;

        preloadedImagesRef.current.add(url);

        const image = new Image();
        image.decoding = "async";
        image.src = url;
      });
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentImageIndex, gallery]);

  useEffect(() => {
    if (!currentImage) return;
    preloadedImagesRef.current.add(currentImage);
  }, [currentImage]);

  useEffect(() => {
    const strip = thumbnailStripRef.current;
    const selectedThumbnail = thumbnailButtonRefs.current[currentImageIndex];

    if (!strip || !selectedThumbnail) return;

    const thumbnailLeft = selectedThumbnail.offsetLeft;
    const thumbnailRight = thumbnailLeft + selectedThumbnail.offsetWidth;
    const visibleLeft = strip.scrollLeft;
    const visibleRight = visibleLeft + strip.clientWidth;

    if (thumbnailLeft < visibleLeft) {
      strip.scrollTo({
        left: Math.max(thumbnailLeft - 16, 0),
        behavior: "smooth",
      });
      return;
    }

    if (thumbnailRight > visibleRight) {
      strip.scrollTo({
        left: thumbnailRight - strip.clientWidth + 16,
        behavior: "smooth",
      });
    }
  }, [currentImageIndex]);

  function nextImage() {
    if (gallery.length === 0) return;

    setCurrentImageIndex((previousIndex) => {
      return (previousIndex + 1) % gallery.length;
    });
  }

  function prevImage() {
    if (gallery.length === 0) return;

    setCurrentImageIndex((previousIndex) => {
      return (previousIndex - 1 + gallery.length) % gallery.length;
    });
  }

  function selectImage(index: number) {
    setCurrentImageIndex(index);
  }

  function openLightbox() {
    if (!currentImage) return;
    setIsLightboxOpen(true);
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
  }

  function formatPrice(price: number | null) {
    if (!price) return "Sob consulta";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function getVisitMessage() {
    const title = property?.title ?? "imóvel EXACT";
    const location = property?.location ? `, em ${property.location}` : "";

    return `Olá. Tenho interesse em agendar uma visita para o imóvel ${title}${location}.`;
  }

  function getWhatsAppUrl(message: string) {
    return `https://wa.me/5541997683715?text=${encodeURIComponent(message)}`;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Carregando imóvel...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Imóvel não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="w-full bg-background">
        <div className="relative h-screen w-full overflow-hidden bg-black">
          {currentImage ? (
            <div
              role="button"
              tabIndex={0}
              onClick={openLightbox}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openLightbox();
                }
              }}
              aria-label="Abrir galeria de imagens"
              className="relative z-10 h-full w-full cursor-pointer overflow-hidden bg-black"
            >
              <img
                key={currentImage}
                src={currentImage}
                alt={property.title ?? "Imagem do imóvel"}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                className="h-full w-full select-none object-cover object-center"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-white/50">Sem imagem</p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />

          <a
            href="/imoveis"
            className="absolute left-6 top-6 z-50 flex items-center gap-2 px-3 py-2 text-sm font-light text-white transition-colors hover:text-white md:left-10 md:top-8"
          >
            <ChevronLeft size={18} />
            Voltar
          </a>

          <a
            href="/"
            className="absolute right-6 top-6 z-50 px-3 py-2 text-sm tracking-[0.28em] text-white transition-opacity duration-300 hover:opacity-90 md:right-10 md:top-8"
            style={{
              filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))",
              textShadow: "0 1px 2px rgba(0,0,0,0.28), 0 0 6px rgba(255,255,255,0.10)",
            }}
          >
            EXACT
          </a>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Foto anterior"
                className="absolute left-6 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/55 md:left-10"
              >
                <ChevronLeft size={25} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Próxima foto"
                className="absolute right-6 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/55 md:right-10"
              >
                <ChevronRight size={25} />
              </button>

              <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[10px] font-light tracking-[0.2em] text-white backdrop-blur-md">
                {currentImageIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="w-full border-b border-border/20 bg-background py-5">
            <div className="w-full overflow-hidden">
              <div
                ref={thumbnailStripRef}
                className="flex w-full justify-start gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 scroll-smooth md:px-8"
              >
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    ref={(element) => {
                      thumbnailButtonRefs.current[index] = element;
                    }}
                    type="button"
                    onClick={() => selectImage(index)}
                    aria-label={`Abrir foto ${index + 1}`}
                    aria-current={currentImageIndex === index ? "true" : undefined}
                    className={`relative h-[70px] w-[110px] shrink-0 overflow-hidden rounded-sm border transition-all duration-300 ${
                      currentImageIndex === index
                        ? "border-foreground opacity-100"
                        : "border-border opacity-50 hover:border-foreground/40 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      width={110}
                      height={70}
                      draggable={false}
                      className="h-full w-full select-none object-cover"
                    />

                    {currentImageIndex === index && (
                      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {isLightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Galeria de imagens do imóvel"
        >
          <img
            src={currentImage}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-35 blur-xl"
          />

          <div className="absolute inset-0 bg-black/75" />

          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Fechar galeria"
            className="absolute right-6 top-6 z-[130] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:right-10 md:top-8"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Fechar imagem ampliada"
            className="absolute inset-0 z-[100] cursor-pointer"
          />

          <img
            key={`lightbox-${currentImage}`}
            src={currentImage}
            alt={property.title ?? "Imagem ampliada do imóvel"}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="relative z-[120] max-h-[84vh] max-w-[84vw] select-none object-contain shadow-2xl"
          />

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Foto anterior"
                className="absolute left-5 top-1/2 z-[130] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:left-10"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Próxima foto"
                className="absolute right-5 top-1/2 z-[130] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 md:right-10"
              >
                <ChevronRight size={28} />
              </button>

              <div className="absolute left-6 top-6 z-[130] text-sm font-light tracking-[0.12em] text-white md:left-10 md:top-8">
                {currentImageIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>
      )}

      <div className="container mx-auto grid gap-16 px-6 py-24 lg:grid-cols-3">
        <div className="space-y-14 lg:col-span-2">
          <div>
            {property.property_code && (
              <p className="mb-4 text-[10px] font-light uppercase tracking-[0.24em] text-muted-foreground">
                Ref. {property.property_code}
              </p>
            )}

            <h1 className="mb-4 text-4xl font-light tracking-tight">
              {property.title ?? "Imóvel EXACT"}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              {property.location ?? "Localização sob consulta"}
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[2rem] font-light tracking-tight md:text-[2.2rem]">
              {formatPrice(property.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-y border-border/20 py-10 sm:grid-cols-4">
            <div className="space-y-3">
              <Ruler size={17} className="text-muted-foreground" />
              <div>
                <p className="text-lg font-light">
                  {property.area ? `${property.area} m²` : "-"}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Área privativa
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Bed size={17} className="text-muted-foreground" />
              <div>
                <p className="text-lg font-light">{property.bedrooms ?? "-"}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Quartos
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Bath size={17} className="text-muted-foreground" />
              <div>
                <p className="text-lg font-light">{property.bathrooms ?? "-"}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Banheiros
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Car size={17} className="text-muted-foreground" />
              <div>
                <p className="text-lg font-light">
                  {property.parking_spots ?? "-"}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Vagas
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="mb-5 text-[11px] tracking-[0.22em] text-muted-foreground">
              DESCRIÇÃO
            </p>
            <p className="whitespace-pre-line text-sm leading-8 text-muted-foreground">
              {property.description ||
                "Imóvel selecionado dentro do padrão EXACT. Localização estratégica, distribuição inteligente e potencial claro de valorização."}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <a
            href={getWhatsAppUrl(
              `Olá. Tenho interesse no imóvel ${
                property.title ?? "imóvel EXACT"
              }${property.property_code ? ` (${property.property_code})` : ""} e gostaria de mais informações.`
            )}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-[#F2F2F2] py-4 text-center text-xs tracking-[0.18em] text-black transition hover:bg-white"
          >
            FALAR NO WHATSAPP
          </a>

          <a
            href={getWhatsAppUrl(getVisitMessage())}
            target="_blank"
            rel="noreferrer"
            className="block w-full border border-border py-4 text-center text-xs tracking-[0.18em] transition hover:border-foreground/40 hover:bg-muted"
          >
            AGENDAR VISITA
          </a>

          <div className="pt-2">
            <ShareButtons
              propertyId={String(property.id)}
              propertyName={property.title ?? "Imóvel EXACT"}
              propertyPrice={formatPrice(property.price)}
              propertyLocation={property.location ?? "Curitiba"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}