import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import {
  CountryDetailsResponse,
  CountryListParams,
  CountryListResponse,
  defaultCountryParams
} from "../models/country.model";

@Injectable({
  providedIn: 'root'
})
export class CountriesApiService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl = '/api/geo/countries';

  public getCountries(params: CountryListParams): Observable<CountryListResponse> {
    const requestParams = new HttpParams().appendAll({
      ...defaultCountryParams,
      ...params
    });
    return this.http.get<CountryListResponse>(this.baseUrl, { params: requestParams });
  }

  public getCountryDetails(
    countryId: string,
    languageCode: string = 'en'
  ): Observable<CountryDetailsResponse> {
    const params = new HttpParams().set('languageCode', languageCode);
    return this.http.get<CountryDetailsResponse>(`${ this.baseUrl }/${ countryId }`, { params });
  }
}
