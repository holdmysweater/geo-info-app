import { TestBed } from '@angular/core/testing';

import { InternationalizationService } from './internationalization.service';

describe('InternationalizationService', () => {
  let service: InternationalizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternationalizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
