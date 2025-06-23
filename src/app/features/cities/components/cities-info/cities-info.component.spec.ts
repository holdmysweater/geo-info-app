import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesInfoComponent } from './cities-info.component';

describe('CitiesInfoComponent', () => {
  let component: CitiesInfoComponent;
  let fixture: ComponentFixture<CitiesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitiesInfoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CitiesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
