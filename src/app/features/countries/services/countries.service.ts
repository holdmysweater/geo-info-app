import { Injectable } from '@angular/core';
import { CountriesApiService } from "./countries.api.service";
import { BehaviorSubject, Observable, switchMap, take, tap } from "rxjs";
import { CountryListResponse, CountrySummary } from "../models/country.model";

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private readonly countries$ = new BehaviorSubject<CountrySummary[]>([]);
  private readonly total$ = new BehaviorSubject<number>(0);
  private readonly currentOffset$ = new BehaviorSubject<number>(0);
  private readonly pageItemsLimit$ = new BehaviorSubject<number>(6);
  private readonly pageCount$ = new BehaviorSubject<number>(1);

  constructor(private readonly api: CountriesApiService) {
  }

  // region GETTERS

  public getCountries$(): Observable<CountrySummary[]> {
    return this.countries$.asObservable();
  }

  public getTotal$(): Observable<number> {
    return this.total$.asObservable();
  }

  public getCurrentOffset$(): Observable<number> {
    return this.currentOffset$.asObservable();
  }

  public getPageItemsLimit$(): Observable<number> {
    return this.pageItemsLimit$.asObservable();
  }

  public getPageCount$(): Observable<number> {
    return this.pageCount$.asObservable();
  }

  // endregion

  // region FETCH

  public fetchCountries(
    namePrefix: string = '',
    languageCode: string = 'en',
    sort: string = 'name',
    pageItemsLimit?: number,
    offset: number = 0
  ): Observable<CountryListResponse> {
    if (pageItemsLimit) this.setPageItemsLimit(pageItemsLimit);
    return this.pageItemsLimit$.pipe(
      take(1),
      switchMap(limit =>
        this.api.getCountries(offset, limit, namePrefix, languageCode, sort).pipe(
          tap((res: CountryListResponse) => this.processCountryListResponse(res, offset))
        )
      )
    );
  }

  public fetchPage(
    pageIndex: number,
    namePrefix: string = '',
    languageCode: string = 'en',
    sort: string = 'name',
    pageItemsLimit?: number
  ): Observable<CountryListResponse> {
    if (pageItemsLimit) this.setPageItemsLimit(pageItemsLimit);
    return this.pageItemsLimit$.pipe(
      take(1),
      switchMap(limit =>
        this.fetchCountries(namePrefix, languageCode, sort, limit, pageIndex * limit)
      )
    );
  }

  // endregion

  // region HELPERS

  private processCountryListResponse(res: CountryListResponse, offset: number): void {
    this.countries$.next(res.data);
    this.total$.next(res.metadata.totalCount);
    this.currentOffset$.next(offset);
    this.setPageCount(res.metadata.totalCount);
  }

  private setPageItemsLimit(limit: number): void {
    this.pageItemsLimit$.next(limit);
  }

  private setPageCount(total: number): void {
    this.pageItemsLimit$.pipe(
      take(1)
    ).subscribe(limit =>
      this.pageCount$.next(Math.ceil(total / limit))
    );
  }

  // endregion
}
