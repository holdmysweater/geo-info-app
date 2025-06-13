import { TestBed } from '@angular/core/testing';

import { CountriesApi } from './countries.api';

describe('CountriesApi', () => {
  let service: CountriesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountriesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
