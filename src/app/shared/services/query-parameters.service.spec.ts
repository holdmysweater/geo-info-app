import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParametersService } from './query-parameters.service';
import { of } from 'rxjs';

describe('QueryParametersService', () => {
  let service: QueryParametersService;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    // Make navigate return a resolved Promise
    routerSpyObj.navigate.and.returnValue(Promise.resolve(true));

    const routeSpyObj = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParamMap: of(new Map([['testKey', 'testValue']]))
    });

    TestBed.configureTestingModule({
      providers: [
        QueryParametersService,
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: routeSpyObj }
      ]
    });

    service = TestBed.inject(QueryParametersService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    routeSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('update', () => {
    it('should call router.navigate with correct parameters', async () => {
      const params = { key: 'value' };
      await service.update(params);

      expect(routerSpy.navigate).toHaveBeenCalledWith([], {
        relativeTo: routeSpy,
        queryParams: params,
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });

    it('should respect replaceUrl option when false', async () => {
      const params = { key: 'value' };
      await service.update(params, { replaceUrl: false });

      expect(routerSpy.navigate).toHaveBeenCalledWith([], {
        relativeTo: routeSpy,
        queryParams: params,
        queryParamsHandling: 'merge',
        replaceUrl: false
      });
    });
  });

  describe('watchParam', () => {
    it('should return an observable of the parameter value', (done) => {
      service.watchParam('testKey').subscribe(value => {
        expect(value).toBe('testValue');
        done();
      });
    });

    it('should only emit when value changes', (done) => {
      // Create a new test module for this specific case
      TestBed.resetTestingModule();

      const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
      routerSpyObj.navigate.and.returnValue(Promise.resolve(true));

      const routeSpyObj = jasmine.createSpyObj('ActivatedRoute', [], {
        queryParamMap: of(
          new Map([['testKey', 'value1']]),
          new Map([['testKey', 'value1']]), // Same value
          new Map([['testKey', 'value2']])
        )
      });

      TestBed.configureTestingModule({
        providers: [
          QueryParametersService,
          { provide: Router, useValue: routerSpyObj },
          { provide: ActivatedRoute, useValue: routeSpyObj }
        ]
      });

      const testService = TestBed.inject(QueryParametersService);
      let emissions = 0;
      const values: (string | null)[] = [];

      testService.watchParam('testKey').subscribe({
        next: value => {
          emissions++;
          values.push(value);
          if (emissions === 2) {
            expect(values).toEqual(['value1', 'value2']);
            done();
          }
        }
      });
    });
  });
});
