import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  priceRanges,
  priceRangesAquisicao,
  PropertyType,
} from "@/lib/properties";

type Property = {
  id: number;
  title: string | null;
  slug: string | null;
  operation: PropertyType | null;
  property_type: string | null;
  location: string | null;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  status: string | null;
  description: string | null;
  cover_image: string | null;
  is_published: boolean | null;
};

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyType, setPropertyType] = useState<PropertyType>("aquisicao");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("properties")
        .select(
          "id, title, slug, operation, property_type, location, price, bedrooms, bathrooms, area, status, description, cover_image, is_published"
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar imóveis:", error);
        setLoadError("Não foi possível carregar os imóveis.");
        setProperties([]);
        setIsLoading(false);
        return;
      }

      setProperties((data ?? []) as Property[]);
      setIsLoading(false);
    }

    loadProperties();
  }, []);

  const neighborhoods = useMemo(() => {
    const uniqueNeighborhoods = new Set<string>();

    properties.forEach((property) => {
      const neighborhood = getNeighborhoodFromLocation(property.location);

      if (neighborhood) {
        uniqueNeighborhoods.add(neighborhood);
      }
    });

    return Array.from(uniqueNeighborhoods).sort((a, b) =>
      a.localeCompare(b, "pt-BR")
    );
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (property.operation !== propertyType) {
        return false;
      }

      const neighborhood = getNeighborhoodFromLocation(property.location);

      if (
        selectedNeighborhoods.length > 0 &&
        !selectedNeighborhoods.includes(neighborhood)
      ) {
        return false;
      }

      if (selectedPriceRange && property.price !== null) {
        if (
          property.price < selectedPriceRange.min ||
          property.price > selectedPriceRange.max
        ) {
          return false;
        }
      }

      if (selectedPriceRange && property.price === null) {
        return false;
      }

      return true;
    });
  }, [properties, propertyType, selectedNeighborhoods, selectedPriceRange]);

  const currentPriceRanges =
    propertyType === "locacao" ? priceRanges : priceRangesAquisicao;

  function getNeighborhoodFromLocation(location: string | null) {
    if (!location) return "Localização não informada";

    return location.split(",")[0]?.trim() || location;
  }

  function toggleNeighborhood(neighborhood: string) {
    setSelectedNeighborhoods((currentNeighborhoods) =>
      currentNeighborhoods.includes(neighborhood)
        ? currentNeighborhoods.filter(
            (currentNeighborhood) => currentNeighborhood !== neighborhood
          )
        : [...currentNeighborhoods, neighborhood]
    );
  }

  function handlePropertyTypeChange(type: PropertyType) {
    setPropertyType(type);
    setSelectedPriceRange(null);
    setSelectedNeighborhoods([]);
  }

  function formatPrice(price: number | null) {
    if (!price) return "Sob consulta";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(price);
  }

  function getPropertyUrl(property: Property) {
    if (property.slug) {
      return `/imoveis/${property.slug}`;
    }

    return `/imoveis/${property.id}`;
  }

  function getPropertyCode(property: Property) {
    return `EX-${String(property.id).padStart(3, "0")}`;
  }

  function getPropertyDescription(property: Property) {
    if (property.description) {
      return property.description;
    }

    return "Imóvel selecionado dentro do padrão EXACT. Localização estratégica, distribuição inteligente e potencial claro de valorização.";
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-24">
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
              {propertyType === "locacao"
                ? "Imóveis para locação"
                : "Imóveis para aquisição"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32">
              <div className="mb-12">
                <h3 className="text-sm font-light mb-6 tracking-wide">
                  Tipo de Imóvel
                </h3>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handlePropertyTypeChange("aquisicao")}
                    className={`block w-full text-left text-xs font-light py-2 px-3 rounded-sm transition-all duration-300 ${
                      propertyType === "aquisicao"
                        ? "bg-muted/30 border border-border/60 text-foreground"
                        : "border border-border/20 text-muted-foreground hover:border-border/40"
                    }`}
                  >
                    Aquisição
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePropertyTypeChange("locacao")}
                    className={`block w-full text-left text-xs font-light py-2 px-3 rounded-sm transition-all duration-300 ${
                      propertyType === "locacao"
                        ? "bg-muted/30 border border-border/60 text-foreground"
                        : "border border-border/20 text-muted-foreground hover:border-border/40"
                    }`}
                  >
                    Locação
                  </button>
                </div>
              </div>

              {neighborhoods.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-sm font-light mb-6 tracking-wide">
                    Localização
                  </h3>

                  <div className="space-y-3">
                    {neighborhoods.map((neighborhood) => (
                      <label
                        key={neighborhood}
                        className="flex items-center gap-3 cursor-pointer"
                      >
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
              )}

              <div className="mb-12">
                <h3 className="text-sm font-light mb-6 tracking-wide">
                  Faixa de Preço
                </h3>

                <div className="space-y-3">
                  {currentPriceRanges.map((range, index) => (
                    <button
                      key={`${range.label}-${index}`}
                      type="button"
                      onClick={() => setSelectedPriceRange(range)}
                      className={`block w-full text-left text-xs font-light py-2 px-3 rounded-sm transition-all duration-300 ${
                        selectedPriceRange?.min === range.min &&
                        selectedPriceRange?.max === range.max
                          ? "bg-muted/30 border border-border/60 text-foreground"
                          : "border border-border/20 text-muted-foreground hover:border-border/40"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedNeighborhoods.length > 0 || selectedPriceRange) && (
                <button
                  type="button"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {isLoading && (
              <div className="text-center py-20">
                <p className="text-sm font-light text-muted-foreground">
                  Carregando imóveis...
                </p>
              </div>
            )}

            {!isLoading && loadError && (
              <div className="text-center py-20">
                <p className="text-sm font-light text-red-400">{loadError}</p>
              </div>
            )}

            {!isLoading && !loadError && filteredProperties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProperties.map((property, index) => (
                  <motion.a
                    key={property.id}
                    href={getPropertyUrl(property)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group cursor-pointer block"
                  >
                    <div className="mb-6 overflow-hidden rounded-sm bg-muted/20">
                      {property.cover_image ? (
                        <motion.img
                          src={property.cover_image}
                          alt={property.title ?? "Imagem do imóvel"}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                          whileHover={{ scale: 1.05 }}
                        />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center border border-border/20">
                          <p className="text-xs text-muted-foreground">
                            Sem imagem
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground font-light tracking-wide mb-1">
                          {getPropertyCode(property)}
                        </p>

                        <h3 className="text-base font-light tracking-tight mb-2">
                          {property.title ?? "Imóvel EXACT"}
                        </h3>
                      </div>

                      <div className="mb-4">
                        <p className="text-lg font-light text-foreground">
                          {formatPrice(property.price)}
                          {property.operation === "locacao" && property.price && (
                            <span className="text-xs text-muted-foreground">
                              /mês
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border/20">
                        <div>
                          <p className="text-xs text-muted-foreground font-light mb-1">
                            Quartos
                          </p>
                          <p className="text-sm font-light">
                            {property.bedrooms ?? "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground font-light mb-1">
                            Banheiros
                          </p>
                          <p className="text-sm font-light">
                            {property.bathrooms ?? "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground font-light mb-1">
                            Área
                          </p>
                          <p className="text-sm font-light">
                            {property.area ? `${property.area}m²` : "-"}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground font-light mb-4">
                        {property.location ?? "Localização sob consulta"}
                      </p>

                      <p className="text-xs font-light text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                        {getPropertyDescription(property)}
                      </p>

                      <div className="w-full px-4 py-2.5 border border-foreground/40 group-hover:border-foreground/60 text-foreground text-xs font-light rounded-sm transition-all duration-300 tracking-wide text-center">
                        MAIS INFORMAÇÕES
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}

            {!isLoading && !loadError && filteredProperties.length === 0 && (
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
                  type="button"
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