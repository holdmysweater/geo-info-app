import { Component, computed, effect, inject, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { CitiesService } from '../../services/cities.service';
import { CitiesTableComponent } from '../../components/cities-table/cities-table.component';
import {
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldDropdownDirective,
  TuiTextfieldOptionsDirective
} from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiChevron, TuiComboBox, TuiDataListWrapperComponent } from '@taiga-ui/kit';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
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
  private readonly countriesService: CountriesService = inject(CountriesService);
  private readonly internationalizationService: InternationalizationService = inject(InternationalizationService);

  protected readonly Array = Array;

  protected readonly searchBarInput: WritableSignal<string> = signal('');
  protected readonly countryDropdownSearchInput: WritableSignal<string | null> = signal(null);

  protected readonly countryDropdownDisplayValue: FormControl<string | null> = new FormControl(null);
  protected readonly countryWikiId = signal<string>('');

  constructor() {
    // Update countries list
    effect(() => {
      this.countriesService.fetchCountries(
        this.countryDropdownSearchInput() ?? '',
        10,
        this.internationalizationService.language()
      ).subscribe();
    });

    // Update city name
    effect(() => {
      const countryWikiId = untracked(() => this.countryWikiId());

      if (null == countryWikiId) return;

      this.countriesService.fetchCountryDetails(
        countryWikiId,
        this.internationalizationService.language()
      ).subscribe(value => {
        this.countryDropdownDisplayValue.setValue(value.name, { emitEvent: false });
      });
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

    this.countryDropdownSearchInput.set(text);
  }

  // endregion

  // region SUBSCRIPTIONS

  private subscribeToDropdownValueChanges() {
    this.countryDropdownDisplayValue.valueChanges.subscribe(value => {
      console.log("Dropdown selected: " + value);

      this.countryWikiId.set(this.countries()?.get(value ?? '') ?? '');
    });
  }

  // endregion
}
