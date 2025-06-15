import { Injectable } from '@angular/core';
import { CountriesApi } from "./countries.api";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { CountryDetail, CountryListLink, CountryListResponse, CountrySummary } from "../models/country.model";

@Injectable({
  providedIn: 'root'
})
export class Countries {
  private readonly countries$ = new BehaviorSubject<CountrySummary[]>([]);
  private readonly total$ = new BehaviorSubject<number>(0);
  private readonly countryDetails$ = new BehaviorSubject<{ [code: string]: CountryDetail }>({});
  private readonly currentOffset$ = new BehaviorSubject<number>(0);
  private readonly pageItemsLimit$ = new BehaviorSubject<number>(6);
  private readonly pageCount$ = new BehaviorSubject<number>(1);

  private links: Record<string, string> = {};

  constructor(private readonly api: CountriesApi) {
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

  public getCountryDetails$(): Observable<{ [code: string]: CountryDetail }> {
    return this.countryDetails$.asObservable();
  }

  public getPageItemsLimit$(): Observable<number> {
    return this.pageItemsLimit$.asObservable();
  }

  public getPageCount$(): Observable<number> {
    return this.pageCount$.asObservable();
  }

  // endregion

  // region PAGE CHECKS

  public hasFirstPage(): boolean {
    return !!this.links['first'];
  }

  public hasLastPage(): boolean {
    return !!this.links['last'];
  }

  public hasPreviousPage(): boolean {
    return !!this.links['prev'];
  }

  public hasNextPage(): boolean {
    return !!this.links['next'];
  }

  // endregion

  // region FETCH

  public fetchCountryDetail(code: string, languageCode: string = 'en'): Observable<CountryDetail> {
    return this.api.getCountry(code, languageCode).pipe(
      map(response => response.data),
      tap(detail => {
        const current = this.countryDetails$.value;
        this.countryDetails$.next({ ...current, [code]: detail });
      })
    );
  }

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

  // region PAGINATION

  public fetchNext(): Observable<CountryListResponse> | undefined {
    return this.fetchCountriesByLink('next');
  }

  public fetchPrev(): Observable<CountryListResponse> | undefined {
    return this.fetchCountriesByLink('prev');
  }

  public fetchFirst(): Observable<CountryListResponse> | undefined {
    return this.fetchCountriesByLink('first');
  }

  public fetchLast(): Observable<CountryListResponse> | undefined {
    return this.fetchCountriesByLink('last');
  }

  // endregion

  // region HELPERS

  private processCountryListResponse(res: CountryListResponse, offset: number): void {
    this.countries$.next(res.data);
    this.total$.next(res.metadata.totalCount);
    this.currentOffset$.next(offset);
    this.setPageCount(res.metadata.totalCount);
    this.setLinks(res.links);
  }

  private setPageItemsLimit(limit: number): void {
    this.pageItemsLimit$.next(limit);
  }

  private setLinks(links: CountryListLink[]): void {
    const mapLinks: Record<string, string> = {};
    links.forEach(l => mapLinks[l.rel] = l.href);
    this.links = mapLinks;
  }

  private setPageCount(total: number): void {
    this.pageItemsLimit$.pipe(
      take(1)
    ).subscribe(limit =>
      this.pageCount$.next(Math.ceil(total / limit))
    );
  }

  private fetchCountriesByLink(
    rel: 'next' | 'prev' | 'first' | 'last'
  ): Observable<CountryListResponse> | undefined {
    const link = this.links[rel];
    if (!link) return;
    return this.pageItemsLimit$.pipe(
      take(1),
      switchMap(limit => this.api.getByLink(link).pipe(
        tap((res: CountryListResponse) => this.processCountryListResponse(res, limit))
      ))
    );
  }

  // endregion
}
