import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CountriesApiService } from "./countries.api.service";
import { CountryDetails, CountryListResponse, CountrySummary } from "../models/country.model";
import { map, Observable, tap } from "rxjs";

@Injectable()
export class CountriesService {
  private readonly api: CountriesApiService = inject(CountriesApiService);

  private readonly _countries: WritableSignal<CountrySummary[]> = signal<CountrySummary[]>([]);
  private readonly _total: WritableSignal<number> = signal<number>(0);
  private readonly _currentOffset: WritableSignal<number> = signal<number>(0);
  private readonly _pageItemsLimit: WritableSignal<number> = signal<number>(6);

  // region GETTERS

  public readonly countries: Signal<CountrySummary[]> = this._countries.asReadonly();
  public readonly total: Signal<number> = this._total.asReadonly();
  public readonly currentOffset: Signal<number> = this._currentOffset.asReadonly();
  public readonly pageItemsLimit: Signal<number> = this._pageItemsLimit.asReadonly();

  public readonly pageCount = computed(() =>
    Math.ceil(this._total() / this._pageItemsLimit())
  );

  // endregion

  // region FETCH

  public fetchCountries(
    namePrefix: string = '',
    pageItemsLimit?: number,
    languageCode: string = 'en',
    sort: string = 'name',
    offset: number = 0
  ): Observable<CountryListResponse> {
    if (pageItemsLimit) this._pageItemsLimit.set(pageItemsLimit);

    return this.api.getCountries({
      offset,
      limit: this._pageItemsLimit(),
      namePrefix,
      languageCode,
      sort
    }).pipe(
      tap((res: CountryListResponse) => this.processCountryListResponse(res, offset))
    );
  }

  public fetchPage(
    pageIndex: number,
    namePrefix: string = '',
    languageCode: string = 'en',
    sort: string = 'name',
    pageItemsLimit?: number
  ): Observable<CountryListResponse> {
    if (pageItemsLimit) this._pageItemsLimit.set(pageItemsLimit);
    const offset = pageIndex * this._pageItemsLimit();
    return this.fetchCountries(namePrefix, undefined, languageCode, sort, offset);
  }

  public fetchCountryDetails(
    countryId: string,
    languageCode: string = 'en'
  ): Observable<CountryDetails> {
    return this.api.getCountryDetails(countryId, languageCode).pipe(
      map(response => response.data)
    );
  }

  // endregion

  // region HELPERS

  private processCountryListResponse(res: CountryListResponse, offset: number): void {
    this._countries.set(res.data);
    this._total.set(res.metadata.totalCount);
    this._currentOffset.set(offset);
  }

  // endregion
}
