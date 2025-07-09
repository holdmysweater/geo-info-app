import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CitiesService } from './cities.service';
import { CitiesApiService } from './cities.api.service';
import { CitiesStorageService } from './cities-storage.service';
import { CitiesListLink, CitiesListMetadata, CitiesListResponse, PopulatedPlaceSummary } from '../models/city.model';
import { of } from 'rxjs';

describe('CitiesService', () => {
  let service: CitiesService;
  let apiServiceSpy: jasmine.SpyObj<CitiesApiService>;
  let storageServiceSpy: jasmine.SpyObj<CitiesStorageService>;

  const mockCities: PopulatedPlaceSummary[] = [
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
      population: 8419000,
      dateOfFoundation: '1624-01-01'
    },
    {
      id: 2,
      wikiDataId: 'Q65',
      type: 'CITY',
      name: 'Los Angeles',
      city: null,
      country: 'United States',
      countryCode: 'US',
      region: 'California',
      regionWdId: 'Q99',
      regionCode: 'CA',
      latitude: 34.0522,
      longitude: -118.2437,
      population: 3971000,
      dateOfFoundation: '1781-09-04'
    }
  ];

  const mockLinks: CitiesListLink[] = [
    { rel: 'self', href: '/api/cities?offset=0' },
    { rel: 'next', href: '/api/cities?offset=2' }
  ];

  const mockMetadata: CitiesListMetadata = {
    currentOffset: 0,
    totalCount: 50
  };

  const mockResponse: CitiesListResponse = {
    links: mockLinks,
    data: mockCities,
    metadata: mockMetadata
  };

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('CitiesApiService', ['getCities']);
    const storageSpy = jasmine.createSpyObj('CitiesStorageService', [
      'mergeCityList',
      'saveEditedCity',
      'getEditedCity'
    ]);

    storageSpy.mergeCityList.and.callFake((cities: PopulatedPlaceSummary[]) => cities);

    TestBed.configureTestingModule({
      providers: [
        CitiesService,
        { provide: CitiesApiService, useValue: apiSpy },
        { provide: CitiesStorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(CitiesService);
    apiServiceSpy = TestBed.inject(CitiesApiService) as jasmine.SpyObj<CitiesApiService>;
    storageServiceSpy = TestBed.inject(CitiesStorageService) as jasmine.SpyObj<CitiesStorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty cities array', () => {
      expect(service.cities()).toEqual([]);
    });

    it('should have pageCount of 0', () => {
      expect(service.pageCount()).toBe(0);
    });

    it('should have default page limit of 6', () => {
      expect(service['_pageItemsLimit']()).toBe(6);
    });
  });

  describe('fetchCities', () => {
    it('should fetch cities with correct parameters', fakeAsync(() => {
      apiServiceSpy.getCities.and.returnValue(of(mockResponse));

      service.fetchCities('Q30').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(apiServiceSpy.getCities).toHaveBeenCalledWith({
        countryIds: 'Q30',
        offset: 0,
        limit: 6,
        namePrefix: '',
        languageCode: 'en',
        sort: 'name'
      });

      tick();
      expect(service.cities()).toEqual(mockCities);
      expect(service['_total']()).toBe(50);
    }));

    it('should update page limit when provided', fakeAsync(() => {
      apiServiceSpy.getCities.and.returnValue(of(mockResponse));

      service.fetchCities('Q30', '', 'en', 'name', 10).subscribe();
      tick();

      expect(service['_pageItemsLimit']()).toBe(10);
      expect(apiServiceSpy.getCities).toHaveBeenCalledWith(jasmine.objectContaining({
        limit: 10
      }));
    }));
  });

  describe('fetchPage', () => {
    it('should calculate correct offset based on page index', fakeAsync(() => {
      apiServiceSpy.getCities.and.returnValue(of(mockResponse));

      service.fetchPage('Q30', 2).subscribe();
      tick();

      expect(apiServiceSpy.getCities).toHaveBeenCalledWith(jasmine.objectContaining({
        offset: 12 // 2 * 6 (default limit)
      }));
    }));

    it('should use custom page limit when provided', fakeAsync(() => {
      apiServiceSpy.getCities.and.returnValue(of(mockResponse));

      service.fetchPage('Q30', 3, '', 'en', 'name', 5).subscribe();
      tick();

      expect(apiServiceSpy.getCities).toHaveBeenCalledWith(jasmine.objectContaining({
        offset: 15 // 3 * 5
      }));
    }));
  });

  describe('edit methods', () => {
    const editedCity: Partial<PopulatedPlaceSummary> = {
      id: 1,
      name: 'New York City',
      population: 8500000
    };

    it('should save edited city to storage and update list', () => {
      service['_cities'].set(mockCities);
      storageServiceSpy.getEditedCity.and.returnValue(null);

      service.saveEditedCity(editedCity);

      expect(storageServiceSpy.saveEditedCity).toHaveBeenCalledWith(editedCity);
      expect(service.cities()[0].name).toBe('New York City');
      expect(service.cities()[0].population).toBe(8500000);
    });

    it('should save partial edits by merging with existing data', () => {
      service['_cities'].set(mockCities);
      storageServiceSpy.getEditedCity.and.returnValue(null);

      service.savePartialCityEdits(1, { population: 8500000 });

      expect(storageServiceSpy.saveEditedCity).toHaveBeenCalled();
      const savedCity = storageServiceSpy.saveEditedCity.calls.mostRecent().args[0];
      expect(savedCity.id).toBe(1);
      expect(savedCity.name).toBe('New York');
      expect(savedCity.population).toBe(8500000);
    });

    it('should merge partial edits with existing edited data', () => {
      const existingEdited = {
        ...mockCities[0],
        name: 'New York City'
      };
      storageServiceSpy.getEditedCity.and.returnValue(existingEdited);

      service.savePartialCityEdits(1, { population: 8500000 });

      const savedCity = storageServiceSpy.saveEditedCity.calls.mostRecent().args[0];
      expect(savedCity.name).toBe('New York City');
      expect(savedCity.population).toBe(8500000);
    });

    it('should warn if city not found when saving partial edits', () => {
      spyOn(console, 'warn');
      service.savePartialCityEdits(999, { population: 1000000 });
      expect(console.warn).toHaveBeenCalledWith('City with ID 999 not found');
    });
  });

  describe('pageCount', () => {
    it('should calculate correct page count', () => {
      // Test with 50 items and default limit (6 per page)
      service['_total'].set(50);
      service['_pageItemsLimit'].set(6);
      expect(service.pageCount()).toBe(9); // 50/6 = 8.33 → 9 pages

      // Test with 50 items and 10 per page
      service['_pageItemsLimit'].set(10);
      expect(service.pageCount()).toBe(5); // 50/10 = 5 pages

      // Test with 51 items and 10 per page
      service['_total'].set(51);
      expect(service.pageCount()).toBe(6); // 51/10 = 5.1 → 6 pages
    });
  });
});
