import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { PaginationService } from '../../services/pagination.service';
import { QueryParametersService } from '../../services/query-parameters.service';
import { of } from 'rxjs';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [
        PaginationService,
        {
          provide: QueryParametersService,
          useValue: {
            watchParam: () => of('2'),
            update: jasmine.createSpy('update')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    paginationService = TestBed.inject(PaginationService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set current page from query param', () => {
    expect(paginationService.currentPage()).toBe(1);
  });
});
