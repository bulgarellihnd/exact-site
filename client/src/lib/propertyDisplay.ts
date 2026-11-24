type PropertyCard = {
  property_code: string | null;
  title: string | null;
  location: string | null;
};

const cardTitles: Record<string, string> = {
  EX0019: "Apartamento no Lalique Residence · Água Verde",
  EX0024: "Duplex com lareira no Helbor Double Life · Ecoville",
  EX0026: "Duplex com varanda gourmet no Helbor Double Life · Ecoville",
  EX0028: "Apartamento com automação no Lalique Residence · Água Verde",
  EX0029: "Apartamento no Hampton Park · Bigorrilho",
};

export function propertyCardTitle(property: PropertyCard) {
  return cardTitles[property.property_code ?? ""] ??
    (property.title?.split("|")[0].trim() || "Imóvel EXACT");
}

export function propertyNeighborhood(location: string | null) {
  const address = location?.split("·")[0].trim() ?? "";
  const parts = address.split(/\s+-\s+|,\s*/).map(part => part.trim()).filter(Boolean);
  const city = parts.findIndex(part => /^Curitiba$/i.test(part));
  const neighborhood = city > 0 ? parts[city - 1] : parts.at(-1);
  return parts.length > 1 && neighborhood && !/^\d|^Curitiba$/i.test(neighborhood)
    ? neighborhood
    : "";
}

export function propertyTypeLabel(value: string) {
  const words = value.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ").toLowerCase();
  const plain = words.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/^casa (?:em )?condominio$/.test(plain)) return "Casa em condomínio";
  return words ? words[0].toUpperCase() + words.slice(1) : "";
}
