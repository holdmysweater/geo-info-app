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
