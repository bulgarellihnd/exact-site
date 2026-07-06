import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Car,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ShareButtons from "@/components/ShareButtons";

type Property = {
  id: number;
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
          "id, title, slug, operation, property_type, location, price, bedrooms, bathrooms, parking_spots, area, status, description, cover_image, is_published"
        )
        .eq("is_published", true);

      const numericId = Number(identifier);

      if (!Number.isNaN(numericId)) {
        query = query.eq("id", numericId);
      } else {
        query = query.eq("slug", identifier);
      }

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
      setIsLoading(false);
    }

    loadProperty();
  }, [params?.id]);

  useEffect(() => {
    function handleKeyboardNavigation(event: KeyboardEvent) {
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") prevImage();
    }

    window.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [gallery.length]);

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
          {gallery.length > 0 ? (
            <img
              key={gallery[currentImageIndex]}
              src={gallery[currentImageIndex]}
              alt={property.title ?? "Imagem do imóvel"}
              className="h-full w-full object-cover object-center transition-opacity duration-500"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-white/50">Sem imagem</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40" />

          <a
            href="/imoveis"
            className="absolute left-6 top-6 z-50 flex items-center gap-2 px-3 py-2 text-sm font-light text-white/85 transition-colors hover:text-white md:left-10 md:top-8"
          >
            <ChevronLeft size={18} />
            Voltar
          </a>

          <a
            href="/"
            className="absolute right-6 top-6 z-50 px-3 py-2 text-sm tracking-[0.28em] text-white/85 transition-colors hover:text-white md:right-10 md:top-8"
          >
            EXACT
          </a>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Foto anterior"
                className="absolute left-6 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/15 text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-black/45 hover:text-white md:left-10"
              >
                <ChevronLeft size={25} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Próxima foto"
                className="absolute right-6 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/15 text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-black/45 hover:text-white md:right-10"
              >
                <ChevronRight size={25} />
              </button>

              <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/25 px-3 py-1 text-[10px] font-light tracking-[0.2em] text-white/70 backdrop-blur-md">
                {currentImageIndex + 1} / {gallery.length}
              </div>
            </>
          )}
        </div>

        {gallery.length > 1 && (
          <div className="w-full border-b border-border/20 bg-background px-5 py-5">
            <div className="mx-auto flex max-w-7xl items-center justify-start gap-2 overflow-x-auto md:justify-center">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => selectImage(index)}
                  aria-label={`Abrir foto ${index + 1}`}
                  className={`relative h-[62px] w-[96px] shrink-0 overflow-hidden rounded-sm border transition-all duration-300 ${
                    currentImageIndex === index
                      ? "border-foreground opacity-100"
                      : "border-border opacity-50 hover:border-foreground/40 hover:opacity-90"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  {currentImageIndex === index && (
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="container mx-auto grid gap-16 px-6 py-24 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          <div>
            <h1 className="mb-3 text-4xl font-light tracking-tight">
              {property.title ?? "Imóvel EXACT"}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} />
              {property.location ?? "Localização sob consulta"}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] tracking-[0.22em] text-muted-foreground">
              PREÇO
            </p>
            <p className="text-3xl font-light">{formatPrice(property.price)}</p>
          </div>

          <div className="grid grid-cols-4 gap-8 border-y border-border/20 py-8 text-sm">
            <div className="space-y-2">
              <Bed size={16} />
              <p>{property.bedrooms ?? "-"}</p>
            </div>

            <div className="space-y-2">
              <Bath size={16} />
              <p>{property.bathrooms ?? "-"}</p>
            </div>

            <div className="space-y-2">
              <Ruler size={16} />
              <p>{property.area ? `${property.area}m²` : "-"}</p>
            </div>

            <div className="space-y-2">
              <Car size={16} />
              <p>{property.parking_spots ?? "-"}</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] tracking-[0.22em] text-muted-foreground">
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
            href={getWhatsAppUrl(getVisitMessage())}
            target="_blank"
            rel="noreferrer"
            className="block w-full border border-border py-4 text-center text-xs tracking-[0.18em] transition hover:bg-muted"
          >
            AGENDAR VISITA
          </a>

          <a
            href={getWhatsAppUrl(
              `Olá. Tenho interesse no imóvel ${property.title ?? "imóvel EXACT"} e gostaria de mais informações.`
            )}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-white py-4 text-center text-xs tracking-[0.18em] text-black transition hover:bg-white/90"
          >
            FALAR NO WHATSAPP
          </a>

          <ShareButtons
            propertyId={String(property.id)}
            propertyName={property.title ?? "Imóvel EXACT"}
            propertyPrice={formatPrice(property.price)}
            propertyLocation={property.location ?? "Curitiba"}
          />
        </div>
      </div>
    </div>
  );
}