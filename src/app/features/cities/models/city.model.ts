export interface CitiesListLink {
  rel: string;
  href: string;
}

export interface PopulatedPlaceSummary {
  id: number;
  wikiDataId: string;
  type: 'ADM2' | 'CITY' | 'ISLAND';
  name: string;
  city: string | null;
  country: string;
  countryCode: string;
  region: string;
  regionWdId: string;
  regionCode: string;
  latitude: number;
  longitude: number;
  population: number;
  dateOfFoundation?: string | null;
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
  data: PopulatedPlaceSummary;
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
