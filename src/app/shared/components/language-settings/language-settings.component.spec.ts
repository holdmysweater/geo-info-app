import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSettings } from './language-settings.component';

describe('LanguageSettings', () => {
  let component: LanguageSettings;
  let fixture: ComponentFixture<LanguageSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSettings]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LanguageSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
