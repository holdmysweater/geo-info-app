import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CitiesListResponse, PopulatedPlaceSummary } from '../models/city.model';
import { CountryListResponse } from '../../countries/models/country.model';
import { CitiesApiService } from './cities.api.service';
import { CountriesApiService } from '../../countries/services/countries.api.service';

@Injectable()
export class CitiesService {
  private readonly api: CitiesApiService = inject(CitiesApiService);
  private readonly countryApi: CountriesApiService = inject(CountriesApiService);

  private readonly _cities: WritableSignal<PopulatedPlaceSummary[]> = signal<PopulatedPlaceSummary[]>([]);
  private readonly _total: WritableSignal<number> = signal<number>(0);
  private readonly _currentOffset: WritableSignal<number> = signal<number>(0);
  private readonly _pageItemsLimit: WritableSignal<number> = signal<number>(5);

  public readonly cities: Signal<PopulatedPlaceSummary[]> = this._cities.asReadonly();
  public readonly total: Signal<number> = this._total.asReadonly();
  public readonly currentOffset: Signal<number> = this._currentOffset.asReadonly();
  public readonly pageItemsLimit: Signal<number> = this._pageItemsLimit.asReadonly();

  public readonly pageCount: Signal<number> = computed(() =>
    Math.ceil(this.total() / this.pageItemsLimit())
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

    return this.api.getCities(
      wikiId,
      offset,
      this._pageItemsLimit(),
      namePrefix,
      languageCode,
      sort
    ).pipe(
      tap((res: CitiesListResponse) => this.processCityListResponse(res, offset))
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

  // region HELPERS

  private processCityListResponse(res: CitiesListResponse, offset: number): void {
    this._cities.set(res.data);
    this._total.set(res.metadata.totalCount);
    this._currentOffset.set(offset);
  }

  // endregion
}
