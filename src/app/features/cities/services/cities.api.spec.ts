import { TestBed } from '@angular/core/testing';

import { CitiesApi } from './cities.api';

describe('CitiesApi', () => {
  let service: CitiesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitiesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
