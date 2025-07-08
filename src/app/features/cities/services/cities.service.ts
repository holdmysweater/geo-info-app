import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { CitiesListResponse, PopulatedPlaceSummary } from '../models/city.model';
import { CitiesApiService } from './cities.api.service';
import { CitiesStorageService } from './cities-storage.service';

@Injectable()
export class CitiesService {
  private readonly api: CitiesApiService = inject(CitiesApiService);
  private readonly storage: CitiesStorageService = inject(CitiesStorageService);

  private readonly _cities: WritableSignal<PopulatedPlaceSummary[]> = signal<PopulatedPlaceSummary[]>([]);
  private readonly _total: WritableSignal<number> = signal<number>(0);
  private readonly _pageItemsLimit: WritableSignal<number> = signal<number>(6);

  public readonly cities: Signal<PopulatedPlaceSummary[]> = this._cities.asReadonly();
  public readonly pageCount: Signal<number> = computed(() =>
    Math.ceil(this._total() / this._pageItemsLimit())
  );

  // region FETCH

  public fetchCities(
    wikiId: string,
    namePrefix: string = '',
    languageCode: string = 'en',
    sort: string = 'name',
    pageItemsLimit?: number,
    offset: number = 0
  ): Observable<CitiesListResponse> {
    if (pageItemsLimit) this._pageItemsLimit.set(pageItemsLimit);

    return this.api.getCities({
      countryIds: wikiId,
      offset,
      limit: this._pageItemsLimit(),
      namePrefix,
      languageCode,
      sort
    }).pipe(
      map(response => ({
        ...response,
        data: this.storage.mergeCityList(response.data)
      })),
      tap((res: CitiesListResponse) => this.processCityListResponse(res))
    );
  }

  public fetchPage(
    wikiId: string,
    pageIndex: number,
    namePrefix: string = '',
    languageCode: string = 'en',
    sort: string = 'name',
    pageItemsLimit?: number
  ): Observable<CitiesListResponse> {
    if (pageItemsLimit) this._pageItemsLimit.set(pageItemsLimit);
    const offset = pageIndex * this._pageItemsLimit();
    return this.fetchCities(wikiId, namePrefix, languageCode, sort, undefined, offset);
  }

  // endregion

  // region EDIT METHODS

  public saveEditedCity(city: Partial<PopulatedPlaceSummary>): void {
    this.storage.saveEditedCity(city);

    const currentCities = this._cities();
    const index = currentCities.findIndex(c => c.id === city.id);
    if (index !== -1) {
      this._cities.update(cities => {
        const updated = [...cities];
        updated[index] = { ...updated[index], ...city };
        return updated;
      });
    }
  }

  public savePartialCityEdits(id: number, partialData: Partial<PopulatedPlaceSummary>): void {
    const existingEdited = this.storage.getEditedCity(id);
    const existingData = existingEdited || this._cities().find(c => c.id === id);

    if (!existingData) {
      console.warn(`City with ID ${ id } not found`);
      return;
    }

    const updatedCity = {
      ...existingData,
      ...partialData,
      id
    } as PopulatedPlaceSummary;

    this.saveEditedCity(updatedCity);
  }

  // endregion

  // region HELPERS

  private processCityListResponse(res: CitiesListResponse): void {
    this._cities.set(res.data);
    this._total.set(res.metadata.totalCount);
  }

  // endregion
}
