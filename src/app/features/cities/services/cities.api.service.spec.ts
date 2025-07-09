import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CitiesApiService } from './cities.api.service';
import { CitiesListResponse } from '../models/city.model';

describe('CitiesApiService', () => {
  let service: CitiesApiService;
  let httpTestingController: HttpTestingController;
  const baseUrl = '/api/geo/cities';

  const mockResponse: CitiesListResponse = {
    links: [
      { rel: 'self', href: `${ baseUrl }?offset=0` },
      { rel: 'next', href: `${ baseUrl }?offset=2` }
    ],
    data: [
      {
        id: 1,
        wikiDataId: 'Q60',
        type: 'CITY',
        name: 'New York',
        city: null,
        country: 'United States',
        countryCode: 'US',
        region: 'New York',
        regionWdId: 'Q1384',
        regionCode: 'NY',
        latitude: 40.7128,
        longitude: -74.0060,
        population: 8419000
      }
    ],
    metadata: {
      currentOffset: 0,
      totalCount: 50
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CitiesApiService]
    });

    service = TestBed.inject(CitiesApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCities', () => {
    it('should make GET request with default parameters', () => {
      const testParams = {
        countryIds: 'US',
        offset: 0,
        limit: 6
      };

      service.getCities(testParams).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );

      expect(req.request.method).toEqual('GET');

      // Check each parameter individually (order-independent)
      const params = req.request.params;
      expect(params.get('countryIds')).toBe('US');
      expect(params.get('offset')).toBe('0');
      expect(params.get('limit')).toBe('6');
      expect(params.get('namePrefix')).toBe('');
      expect(params.get('languageCode')).toBe('en');
      expect(params.get('sort')).toBe('name');

      req.flush(mockResponse);
    });

    it('should override default parameters when provided', () => {
      const testParams = {
        countryIds: 'CA',
        offset: 10,
        limit: 5,
        namePrefix: 'Van',
        languageCode: 'fr',
        sort: 'population'
      };

      service.getCities(testParams).subscribe();

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );

      const params = req.request.params;
      expect(params.get('countryIds')).toBe('CA');
      expect(params.get('offset')).toBe('10');
      expect(params.get('limit')).toBe('5');
      expect(params.get('namePrefix')).toBe('Van');
      expect(params.get('languageCode')).toBe('fr');
      expect(params.get('sort')).toBe('population');

      req.flush(mockResponse);
    });

    it('should maintain default parameters when not overridden', () => {
      const testParams = {
        countryIds: 'US',
        offset: 5,
        limit: 10
      };

      service.getCities(testParams).subscribe();

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );

      const params = req.request.params;
      expect(params.get('countryIds')).toBe('US');
      expect(params.get('offset')).toBe('5');
      expect(params.get('limit')).toBe('10');
      // Defaults should still be present
      expect(params.get('namePrefix')).toBe('');
      expect(params.get('languageCode')).toBe('en');
      expect(params.get('sort')).toBe('name');

      req.flush(mockResponse);
    });

    it('should handle empty namePrefix correctly', () => {
      const testParams = {
        countryIds: 'US',
        offset: 0,
        limit: 6,
        namePrefix: ''
      };

      service.getCities(testParams).subscribe();

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );

      expect(req.request.params.get('namePrefix')).toBe('');
      req.flush(mockResponse);
    });

    it('should return the response data', () => {
      const testParams = {
        countryIds: 'US',
        offset: 0,
        limit: 6
      };

      service.getCities(testParams).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.data.length).toBe(1);
        expect(response.data[0].name).toBe('New York');
      });

      const req = httpTestingController.expectOne(
        req => req.url === baseUrl
      );
      req.flush(mockResponse);
    });
  });
});
