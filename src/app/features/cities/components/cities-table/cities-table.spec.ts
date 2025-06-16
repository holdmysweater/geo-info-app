import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesTable } from './cities-table';

describe('CitiesTable', () => {
  let component: CitiesTable;
  let fixture: ComponentFixture<CitiesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitiesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitiesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
