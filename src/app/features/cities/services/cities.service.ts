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
  private readonly _countriesSearchList: WritableSignal<Map<string, string>> = signal<Map<string, string>>(new Map());

  public readonly cities: Signal<PopulatedPlaceSummary[]> = this._cities.asReadonly();
  public readonly total: Signal<number> = this._total.asReadonly();
  public readonly currentOffset: Signal<number> = this._currentOffset.asReadonly();
  public readonly pageItemsLimit: Signal<number> = this._pageItemsLimit.asReadonly();
  public readonly countriesSearchList: Signal<Map<string, string>> = this._countriesSearchList.asReadonly();

  public readonly pageCount: Signal<number> = computed(() =>
    Math.ceil(this.total() / this.pageItemsLimit())
  );

  private readonly countriesSearchCache = new Map<string, Map<string, string>>();

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

  public fetchCountriesList( // TODO use countries service instead and use computable
    namePrefix: string = '',
    limit: number = 10,
    languageCode: string = 'en',
    sort: string = 'name',
  ): Observable<Map<string, string>> {
    if (this.countriesSearchCache.has(namePrefix)) {
      const cached = this.countriesSearchCache.get(namePrefix) || new Map<string, string>();
      this._countriesSearchList.set(cached);
      return of(cached);
    }

    return this.countryApi.getCountries(0, limit, namePrefix, languageCode, sort).pipe(
      map((res: CountryListResponse) => {
        const countriesMap = new Map<string, string>();
        res.data.forEach(data => countriesMap.set(data.name, data.wikiDataId));
        this.countriesSearchCache.set(namePrefix, countriesMap);
        return countriesMap;
      }),
      tap(values => this._countriesSearchList.set(values)),
      catchError(() => of(new Map<string, string>()))
    );
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
