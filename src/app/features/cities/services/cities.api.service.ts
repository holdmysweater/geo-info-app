import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitiesListResponse } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CitiesApiService {
  private readonly baseUrl = '/api/geo/cities';

  constructor(private readonly http: HttpClient) {
  }

  public getCities(
    wikiId: string,
    offset: number,
    limit: number,
    namePrefix: string,
    languageCode: string,
    sort: string
  ): Observable<CitiesListResponse> {
    const params = new HttpParams()
      .set('countryIds', wikiId)
      .set('offset', offset)
      .set('limit', limit)
      .set('namePrefix', namePrefix)
      .set('languageCode', languageCode)
      .set('sort', sort);

    return this.http.get<CitiesListResponse>(this.baseUrl, { params });
  }
}
