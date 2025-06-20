import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { CountryDetailsResponse, CountryListResponse } from "../models/country.model";

@Injectable({
  providedIn: 'root'
})
export class CountriesApiService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly baseUrl = '/api/geo/countries';

  public getCountries(
    offset: number,
    limit: number,
    namePrefix: string,
    languageCode: string,
    sort: string
  ): Observable<CountryListResponse> {
    const params = new HttpParams()
      .set('offset', offset)
      .set('limit', limit)
      .set('namePrefix', namePrefix)
      .set('languageCode', languageCode)
      .set('sort', sort);

    return this.http.get<CountryListResponse>(this.baseUrl, { params });
  }

  public getCountryDetails(
    countryId: string,
    languageCode: string
  ): Observable<CountryDetailsResponse> {
    const params = new HttpParams()
      .set('languageCode', languageCode);

    return this.http.get<CountryDetailsResponse>(this.baseUrl + '/' + countryId, { params });
  }
}
