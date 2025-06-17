import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, take, tap } from 'rxjs';
import { CitiesListResponse, PopulatedPlaceSummary } from '../models/city.model';
import { CitiesApiService } from './cities.api.service';
import { CountryData, CountryListResponse } from '../../countries/models/country.model';
import { CountriesApiService } from '../../countries/services/countries.api.service';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private readonly cities$ = new BehaviorSubject<PopulatedPlaceSummary[]>([]);
  private readonly total$ = new BehaviorSubject<number>(0);
  private readonly currentOffset$ = new BehaviorSubject<number>(0);
  private readonly pageItemsLimit$ = new BehaviorSubject<number>(5);
  private readonly pageCount$ = new BehaviorSubject<number>(1);
  private readonly countriesSearchList$ = new BehaviorSubject<CountryData[]>([]);

  constructor(private readonly api: CitiesApiService, private readonly countryApi: CountriesApiService) {
  }

  // region GETTERS

  public getCities$(): Observable<PopulatedPlaceSummary[]> {
    return this.cities$.asObservable();
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

  public getCountriesSearchList$(): Observable<CountryData[]> {
    return this.countriesSearchList$.asObservable();
  }

  // endregion

  // region FETCH

  public fetchCities(
    wikiId: string,
    namePrefix: string = '',
    languageCode: string = 'en',
    sort: string = 'name',
    pageItemsLimit?: number,
    offset: number = 0
  ): Observable<CitiesListResponse> {
    if (pageItemsLimit) this.setPageItemsLimit(pageItemsLimit);
    return this.pageItemsLimit$.pipe(
      take(1),
      switchMap(limit =>
        this.api.getCities(wikiId, offset, limit, namePrefix, languageCode, sort).pipe(
          tap((res: CitiesListResponse) => this.processCityListResponse(res, offset))
        )
      )
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
    if (pageItemsLimit) this.setPageItemsLimit(pageItemsLimit);
    return this.pageItemsLimit$.pipe(
      take(1),
      switchMap(limit =>
        this.fetchCities(wikiId, namePrefix, languageCode, sort, limit, pageIndex * limit)
      )
    );
  }

  public fetchCountriesList(
    namePrefix: string = '',
    limit: number = 10,
    languageCode: string = 'en',
    sort: string = 'name',
  ): Observable<CountryData[]> {
    return this.countryApi.getCountries(0, limit, namePrefix, languageCode, sort).pipe(
      switchMap((res: CountryListResponse) => {
        let values = [];
        for (const data of res.data) {
          values.push({
            name: data.name,
            wikiDataId: data.wikiDataId
          } as CountryData)
        }
        this.countriesSearchList$.next(values)
        return this.getCountriesSearchList$();
      })
    )
  }

  // endregion

  // region HELPERS

  private processCityListResponse(res: CitiesListResponse, offset: number): void {
    this.cities$.next(res.data);
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
