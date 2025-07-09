import { TestBed } from '@angular/core/testing';
import { CountriesService } from './countries.service';
import { CountriesApiService } from './countries.api.service';
import {
  CountryDetails,
  CountryDetailsResponse,
  CountryListLink,
  CountryListMetadata,
  CountryListResponse,
  CountrySummary
} from '../models/country.model';
import { of } from 'rxjs';

describe('CountriesService', () => {
  let service: CountriesService;
  let apiServiceSpy: jasmine.SpyObj<CountriesApiService>;

  const mockCountries: CountrySummary[] = [
    {
      code: 'US',
      currencyCodes: ['USD'],
      name: 'United States',
      wikiDataId: 'Q30'
    },
    {
      code: 'CA',
      currencyCodes: ['CAD'],
      name: 'Canada',
      wikiDataId: 'Q16'
    }
  ];

  const mockLinks: CountryListLink[] = [
    { rel: 'self', href: '/countries?offset=0' },
    { rel: 'next', href: '/countries?offset=2' }
  ];

  const mockMetadata: CountryListMetadata = {
    currentOffset: 0,
    totalCount: 20
  };

  const mockResponse: CountryListResponse = {
    links: mockLinks,
    data: mockCountries,
    metadata: mockMetadata
  };

  const mockCountryDetails: CountryDetails = {
    code: 'US',
    callingCode: '1',
    currencyCodes: ['USD'],
    flagImageUri: 'https://flagcdn.com/us.svg',
    name: 'United States',
    numRegions: 50,
    wikiDataId: 'Q30'
  };

  const mockDetailsResponse: CountryDetailsResponse = {
    data: mockCountryDetails
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CountriesApiService', [
      'getCountries',
      'getCountryDetails'
    ]);

    TestBed.configureTestingModule({
      providers: [
        CountriesService,
        { provide: CountriesApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(CountriesService);
    apiServiceSpy = TestBed.inject(CountriesApiService) as jasmine.SpyObj<CountriesApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty countries array', () => {
      expect(service.countries()).toEqual([]);
    });

    it('should have pageCount of 0', () => {
      expect(service.pageCount()).toBe(0);
    });

    it('should have default page limit of 6', () => {
      expect(service['_pageItemsLimit']()).toBe(6);
    });
  });

  describe('fetchCountries', () => {
    it('should fetch countries with default parameters', () => {
      apiServiceSpy.getCountries.and.returnValue(of(mockResponse));

      service.fetchCountries().subscribe();

      expect(apiServiceSpy.getCountries).toHaveBeenCalledWith({
        offset: 0,
        limit: 6,
        namePrefix: '',
        languageCode: 'en',
        sort: 'name'
      });
    });

    it('should update internal state with response data', () => {
      apiServiceSpy.getCountries.and.returnValue(of(mockResponse));

      service.fetchCountries().subscribe();

      expect(service.countries()).toEqual(mockCountries);
      expect(service['_total']()).toBe(20);
      expect(service['_currentOffset']()).toBe(0);
    });

    it('should calculate correct page count', () => {
      apiServiceSpy.getCountries.and.returnValue(of(mockResponse));

      service.fetchCountries().subscribe();

      // 20 total / 6 per page = 4 pages (rounding up)
      expect(service.pageCount()).toBe(4);
    });

    it('should use custom parameters when provided', () => {
      apiServiceSpy.getCountries.and.returnValue(of(mockResponse));

      service.fetchCountries('test', 10, 'fr', 'code', 5).subscribe();

      expect(apiServiceSpy.getCountries).toHaveBeenCalledWith({
        offset: 5,
        limit: 10,
        namePrefix: 'test',
        languageCode: 'fr',
        sort: 'code'
      });
    });
  });

  describe('fetchPage', () => {
    it('should calculate offset based on page index', () => {
      apiServiceSpy.getCountries.and.returnValue(of(mockResponse));

      service.fetchPage(2).subscribe();

      expect(apiServiceSpy.getCountries).toHaveBeenCalledWith({
        offset: 12, // 2 * 6 (default limit)
        limit: 6,
        namePrefix: '',
        languageCode: 'en',
        sort: 'name'
      });
    });

    it('should use custom page limit when provided', () => {
      apiServiceSpy.getCountries.and.returnValue(of(mockResponse));

      service.fetchPage(3, '', 'en', 'name', 5).subscribe();

      expect(apiServiceSpy.getCountries).toHaveBeenCalledWith({
        offset: 15, // 3 * 5
        limit: 5,
        namePrefix: '',
        languageCode: 'en',
        sort: 'name'
      });
    });
  });

  describe('fetchCountryDetails', () => {
    it('should fetch country details with default language', () => {
      apiServiceSpy.getCountryDetails.and.returnValue(of(mockDetailsResponse));

      service.fetchCountryDetails('US').subscribe(result => {
        expect(result).toEqual(mockCountryDetails);
      });

      expect(apiServiceSpy.getCountryDetails).toHaveBeenCalledWith('US', 'en');
    });

    it('should use provided language code', () => {
      apiServiceSpy.getCountryDetails.and.returnValue(of(mockDetailsResponse));

      service.fetchCountryDetails('US', 'fr').subscribe();

      expect(apiServiceSpy.getCountryDetails).toHaveBeenCalledWith('US', 'fr');
    });

    it('should return mapped data from response', () => {
      apiServiceSpy.getCountryDetails.and.returnValue(of(mockDetailsResponse));

      service.fetchCountryDetails('US').subscribe(result => {
        expect(result).toEqual(mockCountryDetails);
      });
    });
  });

  describe('pagination', () => {
    it('should calculate page count correctly with different limits', () => {
      // Test with 20 items and default limit (6 per page)
      service['_total'].set(20);
      service['_pageItemsLimit'].set(6);
      expect(service.pageCount()).toBe(4); // 20/6 = 3.33 → 4 pages

      // Test with 20 items and 5 per page
      service['_pageItemsLimit'].set(5);
      expect(service.pageCount()).toBe(4); // 20/5 = 4 pages

      // Test with 21 items and 5 per page
      service['_total'].set(21);
      expect(service.pageCount()).toBe(5); // 21/5 = 4.2 → 5 pages
    });
  });
});
