import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { properties, neighborhoods, priceRanges, priceRangesAquisicao, PropertyType } from '@/lib/properties';

export default function Properties() {
  const [propertyType, setPropertyType] = useState<PropertyType>('aquisicao');
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Filter properties based on selected filters
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Filter by type
      if (prop.type !== propertyType) return false;

      // Filter by neighborhood
      if (selectedNeighborhoods.length > 0 && !selectedNeighborhoods.includes(prop.neighborhood)) {
        return false;
      }

      // Filter by price range
      if (selectedPriceRange) {
        if (prop.price < selectedPriceRange.min || prop.price > selectedPriceRange.max) {
          return false;
        }
      }

      return true;
    });
  }, [propertyType, selectedNeighborhoods, selectedPriceRange]);

  const toggleNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods(prev =>
      prev.includes(neighborhood)
        ? prev.filter(n => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const currentPriceRanges = propertyType === 'locacao' ? priceRanges : priceRangesAquisicao;

  const formatPrice = (price: number) => {
    if (propertyType === 'locacao') {
      return `R$ ${price.toLocaleString('pt-BR')}`;
    }
    return `R$ ${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
      {/* Header */}
      <div className="border-b border-border/20 py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
              Imóveis
            </h1>
            <p className="text-sm text-muted-foreground font-light tracking-wide">
              {propertyType === 'locacao' ? 'Imóveis para locação' : 'Imóveis para aquisição'}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32">
              {/* Type Filter */}
              <div className="mb-12">
                <h3 className="text-sm font-light mb-6 tracking-wide">Tipo de Imóvel</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setPropertyType('aquisicao');
                      setSelectedPriceRange(null);
                    }}
                    className={`block w-full text-left text-xs font-light py-2 px-3 rounded-sm transition-all duration-300 ${
                      propertyType === 'aquisicao'
                        ? 'bg-muted/30 border border-border/60 text-foreground'
                        : 'border border-border/20 text-muted-foreground hover:border-border/40'
                    }`}
                  >
                    Aquisição
                  </button>
                  <button
                    onClick={() => {
                      setPropertyType('locacao');
                      setSelectedPriceRange(null);
                    }}
                    className={`block w-full text-left text-xs font-light py-2 px-3 rounded-sm transition-all duration-300 ${
                      propertyType === 'locacao'
                        ? 'bg-muted/30 border border-border/60 text-foreground'
                        : 'border border-border/20 text-muted-foreground hover:border-border/40'
                    }`}
                  >
                    Locação
                  </button>
                </div>
              </div>

              {/* Neighborhood Filter */}
              <div className="mb-12">
                <h3 className="text-sm font-light mb-6 tracking-wide">Localização</h3>
                <div className="space-y-3">
                  {neighborhoods.map(neighborhood => (
                    <label key={neighborhood} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedNeighborhoods.includes(neighborhood)}
                        onChange={() => toggleNeighborhood(neighborhood)}
                        className="w-4 h-4 rounded-sm border border-border/40 bg-background cursor-pointer accent-foreground"
                      />
                      <span className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
                        {neighborhood}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-12">
                <h3 className="text-sm font-light mb-6 tracking-wide">Faixa de Preço</h3>
                <div className="space-y-3">
                  {currentPriceRanges.map((range, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`block w-full text-left text-xs font-light py-2 px-3 rounded-sm transition-all duration-300 ${
                        selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max
                          ? 'bg-muted/30 border border-border/60 text-foreground'
                          : 'border border-border/20 text-muted-foreground hover:border-border/40'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedNeighborhoods.length > 0 || selectedPriceRange) && (
                <button
                  onClick={() => {
                    setSelectedNeighborhoods([]);
                    setSelectedPriceRange(null);
                  }}
                  className="w-full text-xs font-light text-muted-foreground hover:text-foreground transition-colors py-2 px-3 border border-border/20 rounded-sm"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProperties.map((property, idx) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="group cursor-pointer"
                  >
                    {/* Image */}
                    <div className="mb-6 overflow-hidden rounded-sm">
                      <motion.img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground font-light tracking-wide mb-1">
                          {property.code}
                        </p>
                        <h3 className="text-base font-light tracking-tight mb-2">
                          {property.title}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <p className="text-lg font-light text-foreground">
                          {formatPrice(property.price)}
                          {propertyType === 'locacao' && <span className="text-xs text-muted-foreground">/mês</span>}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border/20">
                        <div>
                          <p className="text-xs text-muted-foreground font-light mb-1">Quartos</p>
                          <p className="text-sm font-light">{property.bedrooms}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-light mb-1">Banheiros</p>
                          <p className="text-sm font-light">{property.bathrooms}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-light mb-1">Área</p>
                          <p className="text-sm font-light">{property.area}m²</p>
                        </div>
                      </div>

                      {/* Location */}
                      <p className="text-xs text-muted-foreground font-light mb-4">
                        {property.location}
                      </p>

                      {/* Description */}
                      <p className="text-xs font-light text-muted-foreground leading-relaxed mb-6">
                        {property.description}
                      </p>

                      {/* CTA */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full px-4 py-2.5 border border-foreground/40 hover:border-foreground/60 text-foreground text-xs font-light rounded-sm transition-all duration-300 tracking-wide"
                      >
                        MAIS INFORMAÇÕES
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <p className="text-sm font-light text-muted-foreground mb-4">
                  Nenhum imóvel encontrado com os filtros selecionados.
                </p>
                <button
                  onClick={() => {
                    setSelectedNeighborhoods([]);
                    setSelectedPriceRange(null);
                  }}
                  className="text-xs font-light text-foreground hover:text-muted-foreground transition-colors underline"
                >
                  Limpar filtros
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
