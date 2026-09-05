export type ImovelwebListing = {
  sourceListingId: string;
  propertyCode: string;
  sourceUrl: string;
  title: string;
  description: string;
  operation: "locacao" | "aquisicao";
  propertyType: string;
  location: string;
  price: number | null;
  condominiumPrice: number | null;
  iptuPrice: number | null;
  totalArea: number | null;
  privateArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  suites: number | null;
  parkingSpots: number | null;
  imageUrls: string[];
};

export type ExistingProperty = {
  id: number;
  propertyCode: string | null;
  title: string | null;
  location: string | null;
  operation: string | null;
  price: number | null;
  area: number | null;
  sourceListingId: string | null;
  editorialLock: boolean;
};

export type SyncDecision = {
  action: "create" | "update" | "unchanged" | "review";
  listing: ImovelwebListing;
  property?: ExistingProperty;
  confidence: number;
  reasons: string[];
};

