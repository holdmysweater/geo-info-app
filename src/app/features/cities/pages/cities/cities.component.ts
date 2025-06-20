import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CitiesService } from '../../services/cities.service';
import { CitiesTableComponent } from '../../components/cities-table/cities-table.component';
import {
  TuiLoader,
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldDropdownDirective,
  TuiTextfieldOptionsDirective
} from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiChevron, TuiComboBox, TuiDataListWrapperComponent } from '@taiga-ui/kit';
import { ActivatedRoute } from '@angular/router';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { PopulatedPlaceSummary } from '../../models/city.model';
import { InternationalizationService } from '../../../../shared/services/internationalization.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { CountriesService } from '../../../countries/services/countries.service';

@Component({
  selector: 'app-cities',
  imports: [
    CitiesTableComponent,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    TuiTextfieldDirective,
    FormsModule,
    ReactiveFormsModule,
    TuiChevron,
    TuiComboBox,
    TuiTextfieldDropdownDirective,
    TuiDataListWrapperComponent,
    PaginationComponent,
    TranslocoDirective
  ],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css',
  providers: [CitiesService, CountriesService, PaginationService]
})
export class CitiesComponent {
  private readonly citiesService: CitiesService = inject(CitiesService);
  private readonly countriesService: CountriesService = inject(CountriesService);
  private readonly internationalizationService: InternationalizationService = inject(InternationalizationService);

  protected readonly Array = Array;

  protected readonly searchBarInput: WritableSignal<string> = signal('');
  protected readonly countryDropdownInput: WritableSignal<string | null> = signal(null);

  protected readonly countryDropdownFormControl: FormControl<string | null> = new FormControl(null);
  protected readonly countryDropdownValue: WritableSignal<string | null> = signal(null);
  protected readonly countryWikiId = computed(() =>
    this.countries()?.get(this.countryDropdownValue() ?? '') ?? ''
  );

  constructor() {
    // Update countries list
    effect(() => {
      this.countriesService.fetchCountries(
        this.countryDropdownInput() ?? '',
        this.internationalizationService.language(),
        'name',
        10
      ).subscribe();
    });
  }

  private ngOnInit(): void {
    this.subscribeToDropdownValueChanges();
  }

  protected readonly countries: Signal<Map<string, string>> = computed(() => {
    const currentCountries = this.countriesService.countries();
    const countriesMap = new Map<string, string>();

    currentCountries.forEach(country => {
      countriesMap.set(country.name, country.wikiDataId);
      if (this.countryWikiId() === country.wikiDataId) {
        this.countryDropdownFormControl.setValue(country.name);
      }
    });

    return countriesMap;
  });

  // region EVENT HANDLERS

  protected onSearchBarInputChange(text: string) {
    console.log('cities.ts: new search bar input = \"' + text + '\"');

    this.searchBarInput.set(text);
  }

  protected onDropdownInputChange(text: string) {
    console.log('cities.ts: new dropdown input = \"' + text + '\"');

    this.countryDropdownInput.set(text);
  }

  // endregion

  // region SUBSCRIPTIONS

  private subscribeToDropdownValueChanges() {
    this.countryDropdownFormControl.valueChanges.subscribe(value => {
      console.log("Dropdown selected: " + value);

      this.countryDropdownValue.set(this.countryDropdownFormControl.value);
    });
  }

  // endregion
}
