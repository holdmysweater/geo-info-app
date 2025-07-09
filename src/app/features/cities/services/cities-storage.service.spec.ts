import { TestBed } from '@angular/core/testing';
import { CitiesStorageService } from './cities-storage.service';
import { PopulatedPlaceSummary } from '../models/city.model';

describe('CitiesStorageService', () => {
  let service: CitiesStorageService;
  let mockLocalStorage: { [key: string]: string };
  const STORAGE_KEY = 'editedCities';

  const mockCity: PopulatedPlaceSummary = {
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
  };

  const mockEditedCity: Partial<PopulatedPlaceSummary> = {
    id: 1,
    name: 'New York City',
    population: 8500000
  };

  beforeEach(() => {
    mockLocalStorage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    spyOn(console, 'error');

    TestBed.configureTestingModule({
      providers: [CitiesStorageService]
    });

    service = TestBed.inject(CitiesStorageService);
  });

  afterEach(() => {
    mockLocalStorage = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEditedCity', () => {
    it('should return null when no city is edited', () => {
      expect(service.getEditedCity(1)).toBeNull();
    });

    it('should return edited city when it exists', () => {
      mockLocalStorage[STORAGE_KEY] = JSON.stringify({ 1: mockEditedCity });
      expect(service.getEditedCity(1)).toEqual(mockEditedCity);
    });

    it('should return null for non-existent city', () => {
      mockLocalStorage[STORAGE_KEY] = JSON.stringify({ 1: mockEditedCity });
      expect(service.getEditedCity(2)).toBeNull();
    });

    it('should handle JSON parse error', () => {
      mockLocalStorage[STORAGE_KEY] = 'invalid json';
      expect(service.getEditedCity(1)).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('saveEditedCity', () => {
    it('should save city to localStorage', () => {
      service.saveEditedCity(mockEditedCity);
      const storedData = JSON.parse(mockLocalStorage[STORAGE_KEY]);
      expect(storedData[1]).toEqual(mockEditedCity);
    });

    it('should not save when city has no id', () => {
      const invalidCity = { ...mockEditedCity, id: undefined };
      service.saveEditedCity(invalidCity);
      expect(mockLocalStorage[STORAGE_KEY]).toBeUndefined();
    });

    it('should preserve existing edits when saving new ones', () => {
      const existingEdit = { 2: { id: 2, name: 'Los Angeles' } };
      mockLocalStorage[STORAGE_KEY] = JSON.stringify(existingEdit);

      service.saveEditedCity(mockEditedCity);

      const storedData = JSON.parse(mockLocalStorage[STORAGE_KEY]);
      expect(storedData[1]).toEqual(mockEditedCity);
      expect(storedData[2]).toEqual(existingEdit[2]);
    });
  });

  describe('mergeCityList', () => {
    const apiCities: PopulatedPlaceSummary[] = [
      mockCity,
      {
        ...mockCity,
        id: 2,
        name: 'Los Angeles',
        wikiDataId: 'Q65',
        population: 3971000
      }
    ];

    it('should return original list when no edits exist', () => {
      const result = service.mergeCityList(apiCities);
      expect(result).toEqual(apiCities);
    });

    it('should merge edited properties with API data', () => {
      mockLocalStorage[STORAGE_KEY] = JSON.stringify({
        1: mockEditedCity
      });

      const result = service.mergeCityList(apiCities);
      expect(result[0].name).toBe('New York City');
      expect(result[0].population).toBe(8500000);
      expect(result[1]).toEqual(apiCities[1]); // Unedited city remains the same
    });

    it('should handle empty city list', () => {
      const result = service.mergeCityList([]);
      expect(result).toEqual([]);
    });

    it('should handle storage errors gracefully', () => {
      mockLocalStorage[STORAGE_KEY] = 'invalid json';
      const result = service.mergeCityList(apiCities);
      expect(result).toEqual(apiCities);
    });
  });
});
