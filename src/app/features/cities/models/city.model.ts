export interface CitiesListLink {
  rel: string;
  href: string;
}

export interface PopulatedPlaceSummary {
  city: string | null;
  country: string;
  countryCode: string;
  distance?: number;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  population: number;
  region: string;
  regionCode: string;
  regionWdId: string;
  type: 'ADM2' | 'CITY' | 'ISLAND';
  wikiDataId: string;
}

export interface CitiesListMetadata {
  currentOffset: number;
  totalCount: number;
}

export interface CitiesListResponse {
  links: CitiesListLink[];
  data: PopulatedPlaceSummary[];
  metadata: CitiesListMetadata;
}

