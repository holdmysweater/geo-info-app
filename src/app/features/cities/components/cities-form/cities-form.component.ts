import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  TuiButton,
  TuiDateFormat,
  TuiDialogContext,
  TuiLabel,
  TuiLoader,
  TuiNumberFormat,
  TuiNumberFormatSettings,
  TuiTextfieldComponent,
  TuiTextfieldDirective
} from "@taiga-ui/core";
import { TuiInputDateModule, TuiInputModule } from "@taiga-ui/legacy";
import { injectContext } from "@taiga-ui/polymorpheus";
import { CitiesService } from '../../services/cities.service';
import { InternationalizationService } from '../../../../shared/services/internationalization.service';
import { CityDetails } from '../../models/city.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { TuiInputNumberDirective } from '@taiga-ui/kit';

@Component({
  selector: 'app-cities-form',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiInputModule,
    FormsModule,
    TranslocoDirective,
    TuiLoader,
    TuiInputDateModule,
    TuiTextfieldComponent,
    TuiNumberFormat,
    TuiLabel,
    TuiInputNumberDirective,
    TuiTextfieldDirective,
    TuiDateFormat
  ],
  templateUrl: './cities-form.component.html',
  styleUrl: './cities-form.component.less'
})
export class CitiesFormComponent {
  private readonly citiesService: CitiesService = inject(CitiesService);
  private readonly langService: InternationalizationService = inject(InternationalizationService);

  public readonly context: TuiDialogContext<void, string> = injectContext<TuiDialogContext<void, string>>();

  protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly cityDetails: WritableSignal<CityDetails | undefined> = signal<CityDetails | undefined>(undefined);

  constructor() {
    this.loadCityDetails();
  }

  private loadCityDetails(): void {
    this.isLoading.set(true);
    this.citiesService.fetchCityDetails(
      this.context.data ?? '',
      this.langService.language()
    ).subscribe({
      next: (city: CityDetails) => {
        this.cityDetails.set(city);
        this.populateForm(city);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  // region FORM

  protected readonly cityForm = new FormGroup({
    region: new FormControl<string | null>(null, Validators.required),
    population: new FormControl<number | null>(null, Validators.required),
    dateOfFoundation: new FormControl<Date | null>(null),
    longitude: new FormControl<number | null>(null, Validators.required),
    latitude: new FormControl<number | null>(null, Validators.required)
  });

  private populateForm(city: CityDetails): void {
    this.cityForm.patchValue({
      region: city.region,
      population: city.population,
      dateOfFoundation: city.dateOfFoundation,
      longitude: city.longitude,
      latitude: city.latitude
    });
  }

  protected onSubmit() {
    console.warn(this.cityForm.value);

    this.closeDialog();
  }

  // endregion

  // region DIALOG

  protected closeDialog(): void {
    this.context.completeWith();
  }

  // endregion

  // region VALIDATION

  protected readonly numberFormat: Partial<TuiNumberFormatSettings> = {
    precision: 9,
    decimalSeparator: this.langService.decimalSeparator(),
    thousandSeparator: this.langService.thousandSeparator()
  };

  // endregion
}
