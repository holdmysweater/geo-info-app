import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { InternationalizationService } from './internationalization.service';
import { of } from 'rxjs';

describe('InternationalizationService', () => {
  let service: InternationalizationService;
  let translocoSpy: jasmine.SpyObj<TranslocoService>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const translocoSpyObj = jasmine.createSpyObj('TranslocoService', [
      'load',
      'setActiveLang'
    ]);
    translocoSpyObj.load.and.returnValue(of(true));
    translocoSpyObj.setActiveLang.and.callThrough();

    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);

    TestBed.configureTestingModule({
      providers: [
        InternationalizationService,
        { provide: TranslocoService, useValue: translocoSpyObj },
        { provide: 'localStorage', useValue: localStorageSpy }
      ]
    });
  });

  function createService() {
    service = TestBed.inject(InternationalizationService);
    translocoSpy = TestBed.inject(TranslocoService) as jasmine.SpyObj<TranslocoService>;
    return service;
  }

  it('should be created', () => {
    expect(createService()).toBeTruthy();
  });

  it('should not update language if invalid', fakeAsync(() => {
    const service = createService();
    service.setLanguage('fr');
    tick(); // Allow effects to run

    expect(service.language()).not.toBe('fr');
    expect(translocoSpy.setActiveLang).not.toHaveBeenCalledWith('fr');
  }));

  describe('decimalSeparator', () => {
    it('should return comma for Russian', fakeAsync(() => {
      const service = createService();
      service.setLanguage('ru');
      tick();
      expect(service.decimalSeparator()).toBe(',');
    }));

    it('should return dot for English', fakeAsync(() => {
      const service = createService();
      service.setLanguage('en');
      tick();
      expect(service.decimalSeparator()).toBe('.');
    }));
  });

  describe('thousandSeparator', () => {
    it('should return space for both languages', fakeAsync(() => {
      const service = createService();
      service.setLanguage('ru');
      tick();
      expect(service.thousandSeparator()).toBe(' ');

      service.setLanguage('en');
      tick();
      expect(service.thousandSeparator()).toBe(' ');
    }));
  });
});
