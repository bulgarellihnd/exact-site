export type PropertyType = "locacao" | "aquisicao";

export const priceRanges = [
  { label: "Até R$ 5 mil", min: 0, max: 5000 },
  { label: "R$ 5 mil - R$ 10 mil", min: 5000, max: 10000 },
  { label: "R$ 10 mil - R$ 15 mil", min: 10000, max: 15000 },
  { label: "Acima de R$ 15 mil", min: 15000, max: Infinity },
];

export const priceRangesAquisicao = [
  { label: "Até R$ 3 milhões", min: 0, max: 3000000 },
  { label: "R$ 3M - R$ 5M", min: 3000000, max: 5000000 },
  { label: "R$ 5M - R$ 7M", min: 5000000, max: 7000000 },
  { label: "Acima de R$ 7M", min: 7000000, max: Infinity },
];