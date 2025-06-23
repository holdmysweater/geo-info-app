import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
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

  // TODO FormGroup
  protected readonly regionControl: FormControl<string | null> = new FormControl(null);
  protected readonly populationControl: FormControl<number | null> = new FormControl(null);
  protected readonly dateControl: FormControl<Date | null> = new FormControl(null);
  protected readonly longitudeControl: FormControl<number | null> = new FormControl(null);
  protected readonly latitudeControl: FormControl<number | null> = new FormControl(null);

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

  private populateForm(city: CityDetails): void {
    this.regionControl.setValue(city.region);
    this.populationControl.setValue(city.population);
    this.dateControl.setValue(city.dateOfFoundation ?? null);
    this.longitudeControl.setValue(city.longitude);
    this.latitudeControl.setValue(city.latitude);
  }

  protected closeDialog(): void {
    this.context.completeWith();
  }

  // region VALIDATION

  // TODO separators based on localization
  protected readonly numberFormat: Partial<TuiNumberFormatSettings> = {
    precision: 9,
    decimalSeparator: '.',
    thousandSeparator: ','
  };

  // TODO validations for fields

  // endregion
}
