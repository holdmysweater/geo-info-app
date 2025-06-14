import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesApi {
  private readonly baseUrl = 'http://geodb-free-service.wirefreethought.com/v1/geo/countries';

  constructor(private readonly http: HttpClient) {
  }
}
