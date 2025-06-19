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
    TuiLoader
  ],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css',
  providers: [CitiesService, PaginationService]
})
export class CitiesComponent {
  private readonly service = inject(CitiesService);
  private readonly paginationService = inject(PaginationService);
  private readonly internationalizationService: InternationalizationService = inject(InternationalizationService);
  private readonly route = inject(ActivatedRoute);
  protected readonly Array = Array;

  protected isLoading: boolean = false;
  protected readonly cities: Signal<PopulatedPlaceSummary[]> = this.service.cities;
  protected readonly countries: Signal<Map<string, string>> = this.service.countriesSearchList;

  protected readonly totalPageCount: Signal<number> = this.service.pageCount;
  protected readonly currentPageIndex: Signal<number> = computed(() =>
    this.paginationService.params().currentPage
  );

  protected readonly searchBarInput: WritableSignal<string> = signal('');
  protected readonly countryDropdownInput: WritableSignal<string | null> = signal(null);

  protected readonly countryDropdownFormControl: FormControl<string | null> = new FormControl(null);
  protected readonly countryDropdownValue: WritableSignal<string | null> = signal(null);
  protected readonly countryWikiId = computed(() =>
    this.countries()?.get(this.countryDropdownValue() ?? '') ?? ''
  );

  constructor() {
    // Update cities list
    effect(() => {
      this.isLoading = true;

      this.service.fetchPage(
        this.countryWikiId(),
        this.currentPageIndex(),
        this.searchBarInput(),
        this.internationalizationService.language()
      ).subscribe();
    });

    // Reset loading flag after cities update
    effect(() => {
      this.cities();
      this.isLoading = false;
    });

    // Update countries list
    effect(() => {
      this.service.fetchCountriesList(this.countryDropdownInput() ?? '').subscribe();
    });

    // Update total page count for pagination component
    effect(() => {
      this.paginationService.updateTotalPages(this.totalPageCount());
    });
  }

  private ngOnInit(): void {
    this.subscribeToDropdownValueChanges();
    this.handleQueryParameters();
  }

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

  private handleQueryParameters() {
    // TODO
  }

  // endregion
}
