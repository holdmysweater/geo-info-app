import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CitiesListResponse, CityListParams, defaultCityParams } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CitiesApiService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl = '/api/geo/cities';

  public getCities(params: CityListParams): Observable<CitiesListResponse> {
    const requestParams = new HttpParams().appendAll({
      ...defaultCityParams,
      ...params
    });
    return this.http.get<CitiesListResponse>(this.baseUrl, { params: requestParams });
  }
}
