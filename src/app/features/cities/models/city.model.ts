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

export interface CityDetailsResponse {
  data: CityDetails;
}

export interface CityDetails {
  id: number;
  wikiDataId: string;
  type: "ADM2" | "CITY" | "ISLAND";
  name: string;
  city: string | null;
  country: string;
  countryCode: string;
  region: string;
  regionWdId: string;
  regionCode: string;
  elevationMeters: number;
  latitude: number;
  longitude: number;
  population: number;
  timezone: string;
  deleted: boolean;
  dateOfFoundation?: string | null;
}

export interface CityListParams {
  countryIds: string;
  offset: number;
  limit: number;
  namePrefix?: string;
  languageCode?: string;
  sort?: string;
}

export const defaultCityParams: Partial<CityListParams> = {
  namePrefix: '',
  languageCode: 'en',
  sort: 'name',
  offset: 0
};
