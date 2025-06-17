import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { CountryListResponse } from "../models/country.model";

@Injectable({
  providedIn: 'root'
})
export class CountriesApi {
  private readonly baseUrl = '/api/geo/countries';

  constructor(private readonly http: HttpClient) {
  }

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
}
