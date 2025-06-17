import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesList } from './countries-list';

describe('CountriesList', () => {
  let component: CountriesList;
  let fixture: ComponentFixture<CountriesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountriesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
