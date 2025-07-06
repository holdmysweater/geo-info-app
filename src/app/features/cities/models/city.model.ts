export interface CitiesListLink {
  rel: string;
  href: string;
}

export interface PopulatedPlaceBase {
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
}

export interface PopulatedPlaceSummary extends PopulatedPlaceBase {
  distance?: number;
}

export interface CityDetails extends PopulatedPlaceBase {
  elevationMeters: number;
  timezone: string;
  deleted: boolean;
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
  data: CityDetails;
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
