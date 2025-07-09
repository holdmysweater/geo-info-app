import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CountriesApiService } from './countries.api.service';
import { CountryDetailsResponse, CountryListResponse, defaultCountryParams } from '../models/country.model';
import { HttpParams } from '@angular/common/http';

describe('CountriesApiService', () => {
  let service: CountriesApiService;
  let httpTestingController: HttpTestingController;
  const baseUrl = '/api/geo/countries';

  const mockCountryList: CountryListResponse = {
    links: [
      { rel: 'self', href: `${ baseUrl }?offset=0` },
      { rel: 'next', href: `${ baseUrl }?offset=2` }
    ],
    data: [
      { code: 'US', currencyCodes: ['USD'], name: 'United States', wikiDataId: 'Q30' },
      { code: 'CA', currencyCodes: ['CAD'], name: 'Canada', wikiDataId: 'Q16' }
    ],
    metadata: {
      currentOffset: 0,
      totalCount: 20
    }
  };

  const mockCountryDetails: CountryDetailsResponse = {
    data: {
      code: 'US',
      callingCode: '1',
      currencyCodes: ['USD'],
      flagImageUri: 'https://flagcdn.com/us.svg',
      name: 'United States',
      numRegions: 50,
      wikiDataId: 'Q30'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountriesApiService]
    });

    service = TestBed.inject(CountriesApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCountries', () => {
    it('should make GET request with default parameters', () => {
      service.getCountries({ offset: 0, limit: 6 }).subscribe(response => {
        expect(response).toEqual(mockCountryList);
      });

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.toString()).toEqual(
        new HttpParams()
          .appendAll({ ...defaultCountryParams, offset: '0', limit: '6' })
          .toString()
      );

      req.flush(mockCountryList);
    });

    it('should merge provided parameters with defaults', () => {
      const customParams = {
        offset: 10,
        limit: 5,
        namePrefix: 'test',
        languageCode: 'fr',
        sort: 'code'
      };

      service.getCountries(customParams).subscribe();

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );

      expect(req.request.params.toString()).toEqual(
        new HttpParams()
          .appendAll({ ...defaultCountryParams, ...customParams })
          .toString()
      );

      req.flush(mockCountryList);
    });

    it('should override default parameters when provided', () => {
      const overrideParams = {
        offset: 0,
        limit: 10,
        namePrefix: 'search',
        languageCode: 'es',
        sort: 'name'
      };

      service.getCountries(overrideParams).subscribe();

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );

      // Check parameters without worrying about order
      const params = req.request.params;
      expect(params.get('offset')).toBe('0');
      expect(params.get('limit')).toBe('10');
      expect(params.get('namePrefix')).toBe('search');
      expect(params.get('languageCode')).toBe('es');
      expect(params.get('sort')).toBe('name');

      req.flush(mockCountryList);
    });
  });

  describe('getCountryDetails', () => {
    it('should make GET request with default parameters', () => {
      service.getCountries({ offset: 0, limit: 6 }).subscribe(response => {
        expect(response).toEqual(mockCountryList);
      });

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );

      expect(req.request.method).toEqual('GET');
      const params = req.request.params;
      expect(params.get('offset')).toBe('0');
      expect(params.get('limit')).toBe('6');
      expect(params.get('namePrefix')).toBe('');
      expect(params.get('languageCode')).toBe('en');
      expect(params.get('sort')).toBe('name');

      req.flush(mockCountryList);
    });

    it('should use provided language code', () => {
      const countryId = 'CA';
      const languageCode = 'fr';

      service.getCountryDetails(countryId, languageCode).subscribe();

      const req = httpTestingController.expectOne(
        `${ baseUrl }/${ countryId }?languageCode=${ languageCode }`
      );

      expect(req.request.method).toEqual('GET');
      req.flush(mockCountryDetails);
    });

    it('should return country details data', () => {
      const countryId = 'US';

      service.getCountryDetails(countryId).subscribe(response => {
        expect(response).toEqual(mockCountryDetails);
      });

      const req = httpTestingController.expectOne(
        `${ baseUrl }/${ countryId }?languageCode=en`
      );
      req.flush(mockCountryDetails);
    });
  });
});
