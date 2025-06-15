import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesTable } from './countries-table';

describe('CountriesTable', () => {
  let component: CountriesTable;
  let fixture: ComponentFixture<CountriesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountriesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
