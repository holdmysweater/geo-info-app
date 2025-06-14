import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesApi {

  constructor(private readonly http: HttpClient) {
  }
}
