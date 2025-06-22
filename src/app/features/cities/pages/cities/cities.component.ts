import { Component, computed, effect, inject, input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
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
  styleUrl: './cities.component.less',
  providers: [CountriesService, PaginationService]
})
export class CitiesComponent {
  private readonly countriesService: CountriesService = inject(CountriesService);
  private readonly queryService: QueryParametersService = inject(QueryParametersService);
  private readonly langService: InternationalizationService = inject(InternationalizationService);
  protected readonly Array = Array;

  protected searchParam: InputSignal<string> = input('', { alias: 'search' });
  protected readonly searchFormControl: FormControl<string | null> = new FormControl('');

  protected wikiIdParam: InputSignal<string> = input('', { alias: 'country' });
  protected countryWikiId: WritableSignal<string> = signal<string>('');

  protected readonly countryDropdownSearchInput: WritableSignal<string | null> = signal(null);
  protected readonly countryDropdownDisplayValue: FormControl<string | null> = new FormControl(null);

  constructor() {
    // Update countries list
    effect(() => {
      this.countriesService.fetchCountries(
        this.countryDropdownSearchInput() ?? '',
        10,
        this.langService.language()
      ).subscribe();
    });

    // Update search - URL to Input
    effect(() => {
      if ('' === this.searchParam()) return;
      this.searchFormControl.setValue(this.searchParam(), { emitEvent: false });
      this.queryService.update({
        search: this.searchParam(),
      }).then();
    });

    // Update search - Input to URL
    this.searchFormControl.valueChanges.subscribe(value => {
      this.queryService.update({
        search: value,
        page: 1
      }).then();
    });

    // Update dropdown input - URL to Input
    effect(() => {
      if ('' == this.wikiIdParam() || undefined == this.wikiIdParam()) return;

      this.countriesService.fetchCountryDetails(
        this.wikiIdParam(),
        this.langService.language()
      ).subscribe({
        next: (value) => {
          this.countryDropdownDisplayValue.setValue(value.name, { emitEvent: false });
          this.countryWikiId.set(value.wikiDataId);
          this.queryService.update({
            country: value.wikiDataId,
          }).then();
        },
        error: () => {
          this.queryService.update({
            country: '',
          }).then();
        }
      });
    });

    // Update dropdown input - Input to URL
    this.countryDropdownDisplayValue.valueChanges.subscribe(value => {
      console.log("Dropdown selected: " + value);

      this.queryService.update({
        country: this.countries()?.get(value ?? '') ?? '',
        page: 1
      }).then();
    });
  }

  protected readonly countries: Signal<Map<string, string>> = computed(() => {
    const countriesMap = new Map<string, string>();

    this.countriesService.countries().forEach(country => {
      countriesMap.set(country.name, country.wikiDataId);
    });

    return countriesMap;
  });

  protected onDropdownInputChange(text: string) {
    console.log('cities.ts: new dropdown input = \"' + text + '\"');

    this.countryDropdownSearchInput.set(text);
  }
}
