import { useState } from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Ruler, Car } from 'lucide-react';
import { properties } from '@/lib/properties';
import ShareButtons from '@/components/ShareButtons';

export default function PropertyDetail() {
  const [, params] = useRoute('/imoveis/:id');

  const property = properties.find(p => p.id === Number(params?.id));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Imóvel não encontrado</p>
      </div>
    );
  }

  const gallery = property.gallery?.length
    ? property.gallery
    : [property.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const formatPrice = (price: number) => {
    return `R$ ${(price / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur border-b border-border/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/imoveis" className="flex items-center gap-2 text-sm">
            <ChevronLeft size={18} />
            Voltar
          </a>
          <span className="text-sm tracking-widest">EXACT</span>
        </div>
      </nav>

      {/* GALERIA */}
      <div className="pt-16 relative h-[80vh] bg-black">
        <img
          src={gallery[currentImageIndex]}
          className="w-full h-full object-cover"
        />

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2"
        >
          <ChevronRight />
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="container mx-auto px-6 py-16 grid lg:grid-cols-3 gap-16">

        {/* ESQUERDA */}
        <div className="lg:col-span-2 space-y-10">

          <div>
            <h1 className="text-3xl font-light mb-2">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin size={14} />
              {property.location}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">PREÇO</p>
            <p className="text-2xl font-light">
              {formatPrice(property.price)}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6 text-sm">
            <div><Bed size={16}/> {property.bedrooms}</div>
            <div><Bath size={16}/> {property.bathrooms}</div>
            <div><Ruler size={16}/> {property.area}m²</div>
            <div><Car size={16}/> {property.garage || 2}</div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-3">DESCRIÇÃO</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {property.description || "Imóvel selecionado dentro do padrão EXACT. Localização estratégica, distribuição inteligente e potencial claro de valorização."}
            </p>
          </div>

          {property.amenities && (
            <div>
              <p className="text-xs text-muted-foreground mb-3">COMODIDADES</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                {property.amenities.map((a, i) => (
                  <div key={i}>• {a}</div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* DIREITA */}
        <div className="space-y-6">

          <button className="w-full border border-border py-3 text-sm hover:bg-muted transition">
            AGENDAR VISITA
          </button>

          <a
            href={`https://wa.me/5541997683715?text=Tenho interesse no imóvel: ${property.title}`}
            target="_blank"
            className="block text-center w-full bg-white text-black py-3 text-sm"
          >
            FALAR NO WHATSAPP
          </a>

          <ShareButtons
            propertyId={property.id}
            propertyName={property.title}
            propertyPrice={formatPrice(property.price)}
            propertyLocation={property.location}
          />

        </div>

      </div>

    </div>
  );
}
