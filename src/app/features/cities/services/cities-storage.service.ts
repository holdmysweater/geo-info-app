import { Injectable } from '@angular/core';
import { CityDetails, PopulatedPlaceSummary } from '../models/city.model';

@Injectable({ providedIn: 'root' })
export class CitiesStorageService {
  private readonly STORAGE_KEY = 'editedCities';

  private get storage(): Record<number, Partial<CityDetails>> {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : {};
    } catch (e) {
      console.error('Error reading edited cities from storage', e);
      return {};
    }
  }

  // region EDITED CITY

  public getEditedCity(id: number): Partial<CityDetails> | null {
    return this.storage[id] || null;
  }

  public saveEditedCity(city: Partial<CityDetails>): void {
    if (!city.id) return;

    const cities = this.storage;
    cities[city.id] = city;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cities));
    } catch (e) {
      console.error('Error saving edited city', e);
    }

    console.log(this.storage);
  }

  // endregion

  // region MERGE

  public mergeWithApiData(apiCity: CityDetails): CityDetails {
    const editedCity = this.getEditedCity(apiCity.id);
    return editedCity ? { ...apiCity, ...editedCity } : apiCity;
  }

  public mergeCityList(apiCities: PopulatedPlaceSummary[]): PopulatedPlaceSummary[] {
    const editedCities = this.storage;
    return apiCities.map(city => {
      const editedCity = editedCities[city.id];
      return editedCity ? { ...city, ...editedCity } : city;
    });
  }

  // endregion
}
