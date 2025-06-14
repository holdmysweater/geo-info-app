import { Injectable } from '@angular/core';
import { CountriesApi } from "./countries.api";

@Injectable({
  providedIn: 'root'
})
export class Countries {

  constructor(private readonly api: CountriesApi) {
  }
}
