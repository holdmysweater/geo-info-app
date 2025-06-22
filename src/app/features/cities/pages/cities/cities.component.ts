import { Component, computed, effect, inject, input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
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
import { QueryParametersService } from '../../../../shared/services/query-parameters.service';

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
  private readonly queryParamsService: QueryParametersService = inject(QueryParametersService);
  private readonly internationalizationService: InternationalizationService = inject(InternationalizationService);

  protected readonly Array = Array;

  protected searchParam: InputSignal<string> = input('', { alias: 'search' });
  protected readonly searchFormControl: FormControl<string | null> = new FormControl('');

  protected wikiIdParam: InputSignal<string> = input('', { alias: 'country' });
  protected countryWikiId: WritableSignal<string> = signal<string>('');

  protected readonly countryDropdownSearchInput: WritableSignal<string | null> = signal(null);
  protected readonly countryDropdownDisplayValue: FormControl<string | null> = new FormControl(null);

  protected readonly countries: Signal<Map<string, string>> = computed(() => {
    const currentCountries = this.countriesService.countries();
    const countriesMap = new Map<string, string>();

    currentCountries.forEach(country => {
      countriesMap.set(country.name, country.wikiDataId);
    });

    return countriesMap;
  });

  constructor() {
    // Update countries list
    effect(() => {
      this.countriesService.fetchCountries(
        this.countryDropdownSearchInput() ?? '',
        10,
        this.internationalizationService.language()
      ).subscribe();
    });

    // Set search input from query params
    effect(() => {
      if ('' === this.searchParam()) return;
      this.searchFormControl.setValue(this.searchParam(), { emitEvent: false });
      this.queryParamsService.update({
        search: this.searchParam(),
      }).then();
    });

    // Update query params to match search input
    this.searchFormControl.valueChanges.subscribe(value => {
      this.queryParamsService.update({
        search: value,
        page: 1
      }).then();
    });

    // Set dropdown input from query params
    effect(() => {
      if ('' == this.wikiIdParam() || undefined == this.wikiIdParam()) return;

      this.countriesService.fetchCountryDetails(
        this.wikiIdParam(),
        this.internationalizationService.language()
      ).subscribe({
        next: (value) => {
          this.countryDropdownDisplayValue.setValue(value.name, { emitEvent: false });
          this.countryWikiId.set(value.wikiDataId);
          this.queryParamsService.update({
            country: value.wikiDataId,
          }).then();
        },
        error: () => {
          this.queryParamsService.update({
            country: '',
          }).then();
        }
      });
    });

    // Update query params to match dropdown input
    this.countryDropdownDisplayValue.valueChanges.subscribe(value => {
      console.log("Dropdown selected: " + value);

      this.queryParamsService.update({
        country: this.countries()?.get(value ?? '') ?? '',
        page: 1
      }).then();
    });
  }

  // region EVENT HANDLERS

  protected onDropdownInputChange(text: string) {
    console.log('cities.ts: new dropdown input = \"' + text + '\"');

    this.countryDropdownSearchInput.set(text);
  }

  // endregion
}
