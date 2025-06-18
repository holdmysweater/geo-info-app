import { Component, inject } from '@angular/core';
import { CitiesService } from '../../services/cities.service';
import { PopulatedPlaceSummary } from '../../models/city.model';
import { CitiesTableComponent } from '../../components/cities-table/cities-table.component';
import {
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldDropdownDirective,
  TuiTextfieldOptionsDirective
} from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiChevron, TuiComboBox, TuiDataListWrapperComponent, TuiPagination } from '@taiga-ui/kit';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cities',
  imports: [
    CitiesTableComponent,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    TuiTextfieldDirective,
    FormsModule,
    ReactiveFormsModule,
    TuiPagination,
    TuiChevron,
    TuiComboBox,
    TuiTextfieldDropdownDirective,
    TuiDataListWrapperComponent
  ],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.css'
})
export class CitiesComponent {
  private service = inject(CitiesService);
  private route = inject(ActivatedRoute);
  protected readonly Array = Array;

  protected countryDropdown: FormControl<string | null> = new FormControl(null);
  protected searchBarInput: FormControl<string | null> = new FormControl('');

  protected countries: Map<string, string> | null = null;
  protected cities: PopulatedPlaceSummary[] | null = [];
  protected pageCount: number = 1;

  private ngOnInit(): void {
    this.subscribeToDropdownValueChanges();
    this.subscribeToCountriesSearchListChanges();
    this.subscribeToCitiesChanges();
    this.subscribeToPageCountChanges();
    this.handleQueryParameters();

    if (null === this.countries) {
      this.service.fetchCountriesList('').subscribe();
    }
  }

  // region

  private getWikiId() {
    return this.countries?.get(this.countryDropdown.value ?? '') ?? '';
  }

  private getSearchBarInput() {
    return this.searchBarInput.value ?? '';
  }

  private fetchCities() {
    this.cities = null;
    this.service.fetchCities(this.getWikiId(), this.getSearchBarInput()).subscribe();
  }

  // endregion

  // region EVENT HANDLERS

  protected onPageClick(pageIndex: number): void {
    console.log('cities.ts: clicked on page index = ' + pageIndex);

    this.service.fetchPage(this.getWikiId(), pageIndex, this.getSearchBarInput()).subscribe();
  }

  protected onSearchBarInputChange() {
    console.log('cities.ts: new search bar input = \"' + this.getSearchBarInput() + '\"');

    if (this.countryDropdown.value == null) return;

    this.fetchCities();
  }

  protected onDropdownInputChange(input: string) {
    console.log('cities.ts: new dropdown input = \"' + input + '\"');

    this.countries = null;
    this.service.fetchCountriesList(input).subscribe();
  }

  // endregion

  // region SUBSCRIPTIONS

  private subscribeToDropdownValueChanges() {
    this.countryDropdown.valueChanges.subscribe(value => {
      console.log("Dropdown selected: " + value);

      if (null === value) return;

      this.fetchCities();
    });
  }

  private subscribeToCountriesSearchListChanges() {
    this.service.getCountriesSearchList$().subscribe(countries => {
      this.countries = countries;
    });
    this.countries = null;
  }

  private subscribeToCitiesChanges() {
    this.service.getCities$().subscribe(cities => {
      this.cities = [];
      for (const city of cities) {
        this.cities.push(city);
      }
    });
  }

  private subscribeToPageCountChanges() {
    this.service.getPageCount$().subscribe(pageCount => {
      this.pageCount = pageCount;
    });
  }

  private handleQueryParameters() {
    this.route.queryParams.subscribe(params => {
      const wikiId = params['wikiId'];
      const name = params['name'];

      if (wikiId != null && name != null) {
        this.countries = new Map<string, string>();
        this.countries.set(name, wikiId);
        this.countryDropdown.setValue(name);
      }
    });
  }

  // endregion
}
