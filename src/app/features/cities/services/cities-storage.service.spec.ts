import { TestBed } from '@angular/core/testing';

import { CitiesStorageService } from './cities-storage.service';

describe('CitiesStorageService', () => {
  let service: CitiesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitiesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
