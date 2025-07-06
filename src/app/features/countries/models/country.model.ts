export interface CountryListLink {
  rel: string;
  href: string;
}

export interface CountrySummary {
  code: string;
  currencyCodes: string[];
  name: string;
  wikiDataId: string;
}

export interface CountryListMetadata {
  currentOffset: number;
  totalCount: number;
}

export interface CountryListResponse {
  links: CountryListLink[];
  data: CountrySummary[];
  metadata: CountryListMetadata;
}

export interface CountryDetailsResponse {
  data: CountryDetails;
}

export interface CountryDetails {
  code: string;
  callingCode: string;
  currencyCodes: string[];
  flagImageUri: string;
  name: string;
  numRegions: number;
  wikiDataId: string;
}

export interface CountryListParams {
  offset: number;
  limit: number;
  namePrefix?: string;
  languageCode?: string;
  sort?: string;
}

export const defaultCountryParams: Partial<CountryListParams> = {
  namePrefix: '',
  languageCode: 'en',
  sort: 'name',
  offset: 0
};
