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

  private links: Record<string, string> = {};

  constructor(private readonly api: CountriesApi) {
  }

  private setPageItemsLimit(limit: number): void {
    this.pageItemsLimit$.next(limit);
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

  // endregion
}
