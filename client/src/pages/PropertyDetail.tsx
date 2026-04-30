import { useState } from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Ruler, Car, Calendar } from 'lucide-react';
import { properties } from '@/lib/properties';
import ShareButtons from '@/components/ShareButtons';

export default function PropertyDetail() {
  const [, params] = useRoute('/imoveis/:id');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', date: '', message: '', timePreference: 'manha' });


  const property = properties.find(p => p.id === params?.id);

  const getSimilarProperties = () => {
    if (!property) return [];
    
    return properties
      .filter(p => p.id !== property.id)
      .map(p => {
        let score = 0;
        
        // Mesmo tipo (locação/aquisição)
        if (p.type === property.type) score += 30;
        
        // Mesma localização
        if (p.location === property.location) score += 25;
        
        // Mesmo número de quartos
        if (p.bedrooms === property.bedrooms) score += 20;
        
        // Preço similar (±20%)
        const priceDiff = Math.abs(p.price - property.price) / property.price;
        if (priceDiff <= 0.2) score += 25;
        
        return { property: p, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.property);
  };

  const similarProperties = getSimilarProperties();

  const formatPrice = (price: number, type?: string) => {
    const propType = type || property?.type;
    if (propType === 'locacao') {
      return `R$ ${price.toLocaleString('pt-BR')}`;
    }
    return `R$ ${(price / 1000000).toFixed(1)}M`;
  };



  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Imóvel não encontrado</h1>
          <a href="/imoveis" className="text-muted-foreground hover:text-foreground">
            Voltar para listagem
          </a>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.gallery.length) % property.gallery.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Agendamento:', formData);
    setShowScheduleForm(false);
    setFormData({ name: '', phone: '', date: '', message: '', timePreference: 'manha' });
  };

  const heartVariants = {
    initial: { scale: 1 },
    favorited: {
      scale: [1, 1.3, 1],
      transition: {
        duration: 0.6,
      },
    },
    unfavorited: {
      scale: [1, 0.8, 1],
      opacity: [1, 0.7, 1],
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="container flex items-center justify-between h-16">
          <a href="/imoveis" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
            <span className="text-sm font-light">Voltar</span>
          </a>
          <a href="/" className="text-sm font-light tracking-[0.15em]">
            EXACT
          </a>
          <div className="w-12" />
        </div>
      </nav>

      {/* Gallery */}
      <div className="relative w-full h-screen pt-16 bg-muted">
        <motion.img
          key={currentImageIndex}
          src={property.gallery[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Gallery Controls */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/80 p-2 rounded-sm transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/80 p-2 rounded-sm transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-background/60 px-3 py-1 rounded-sm text-xs font-light">
          {currentImageIndex + 1} / {property.gallery.length}
        </div>
      </div>

      {/* Content */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-light text-muted-foreground mb-2 tracking-wide">
                      {property.code}
                    </p>
                    <h1 className="text-4xl font-light mb-2">{property.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      <span className="text-sm font-light">{property.location}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Price */}
              <div className="mb-12 pb-12 border-b border-border/20">
                <p className="text-xs font-light text-muted-foreground mb-2 tracking-wide">PREÇO</p>
                <p className="text-3xl font-light">{formatPrice(property.price)}</p>
              </div>

              {/* Characteristics */}
              <div className="mb-12 pb-12 border-b border-border/20">
                <p className="text-xs font-light text-muted-foreground mb-6 tracking-wide">CARACTERÍSTICAS</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Bed size={16} className="text-muted-foreground" />
                      <span className="text-xs font-light text-muted-foreground">Quartos</span>
                    </div>
                    <p className="text-lg font-light">{property.bedrooms}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Bath size={16} className="text-muted-foreground" />
                      <span className="text-xs font-light text-muted-foreground">Banheiros</span>
                    </div>
                    <p className="text-lg font-light">{property.bathrooms}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler size={16} className="text-muted-foreground" />
                      <span className="text-xs font-light text-muted-foreground">Área</span>
                    </div>
                    <p className="text-lg font-light">{property.area}m²</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Car size={16} className="text-muted-foreground" />
                      <span className="text-xs font-light text-muted-foreground">Garagem</span>
                    </div>
                    <p className="text-lg font-light">{property.garage}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-12 pb-12 border-b border-border/20">
                <p className="text-xs font-light text-muted-foreground mb-4 tracking-wide">DESCRIÇÃO</p>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-12">
                <p className="text-xs font-light text-muted-foreground mb-4 tracking-wide">COMODIDADES</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="text-sm font-light text-muted-foreground">
                      • {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="text-xs font-light text-muted-foreground space-y-2">
                <p>Construído em: {property.yearBuilt}</p>
                <p>Coordenadas: {property.coordinates.lat}, {property.coordinates.lng}</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Map */}
              <div className="h-64 bg-muted rounded-sm overflow-hidden border border-border/20">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.5${Math.random().toString().slice(2, 8)}!2d${property.coordinates.lng}!3d${property.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDI1JzQ0LjQiUyA0OcKwMTYnMDEuNiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890`}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Schedule Button */}
              <button
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className="w-full py-3 px-4 border border-border/40 hover:border-border/60 text-sm font-light transition-colors rounded-sm"
              >
                AGENDAR VISITA
              </button>

              {/* Share Button */}
              <ShareButtons
                propertyId={property.id}
                propertyName={property.title}
                propertyPrice={formatPrice(property.price)}
                propertyLocation={property.location}
              />

              {/* Schedule Form */}
              {showScheduleForm && (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-4 border-t border-border/20"
                >
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border/20 rounded-sm text-sm font-light focus:outline-none focus:border-border/60 transition-colors"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Seu telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border/20 rounded-sm text-sm font-light focus:outline-none focus:border-border/60 transition-colors"
                    required
                  />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border/20 rounded-sm text-sm font-light focus:outline-none focus:border-border/60 transition-colors"
                    required
                  />
                  <select
                    value={formData.timePreference}
                    onChange={(e) => setFormData({ ...formData, timePreference: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border/20 rounded-sm text-sm font-light focus:outline-none focus:border-border/60 transition-colors"
                  >
                    <option value="manha">Manhã (08:00 - 12:00)</option>
                    <option value="tarde">Tarde (12:00 - 18:00)</option>
                    <option value="noite">Noite (18:00 - 20:00)</option>
                  </select>
                  <textarea
                    placeholder="Mensagem ou observações (opcional)"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-muted border border-border/20 rounded-sm text-sm font-light focus:outline-none focus:border-border/60 transition-colors resize-none h-20"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-muted hover:bg-muted/80 text-sm font-light transition-colors rounded-sm"
                  >
                    CONFIRMAR
                  </button>
                </motion.form>
              )}

              {/* Contact Info */}
              <div className="pt-6 border-t border-border/20 space-y-3">
                <p className="text-xs font-light text-muted-foreground tracking-wide">ENTRE EM CONTATO</p>
                <a
                  href="tel:(41)99768-3715"
                  className="block text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  (41) 99768-3715
                </a>
                <a
                  href="mailto:contato@exact.com.br"
                  className="block text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  contato@exact.com.br
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-24 pt-12 border-t border-border/20">
            <h2 className="text-2xl font-light mb-8">IMÓVEIS SEMELHANTES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((prop) => (
                <motion.a
                  key={prop.id}
                  href={`/imoveis/${prop.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="group cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="aspect-square bg-muted rounded-sm overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground font-light">IMAGEM</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-light group-hover:text-muted-foreground/80 transition-colors">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-light flex items-center gap-1">
                        <MapPin size={12} />
                        {prop.location}
                      </p>
                      <p className="text-sm font-light">{formatPrice(prop.price, prop.type)}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground font-light pt-2">
                        <span className="flex items-center gap-1">
                          <Bed size={12} />
                          {prop.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath size={12} />
                          {prop.bathrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Ruler size={12} />
                          {prop.area}m²
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
