import { Component } from '@angular/core';
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
  protected countryDropdown: FormControl<string | null> = new FormControl(null);
  protected countries: Map<string, string> | null = null;
  protected cities: PopulatedPlaceSummary[] | null = [];
  protected pageCount: number = 1;
  protected searchBarInput: FormControl<string | null> = new FormControl('');
  protected readonly Array = Array;

  constructor(private service: CitiesService) {
  }

  private ngOnInit(): void {
    this.countryDropdown.valueChanges.subscribe(value => {
      console.log("Dropdown selected: " + value);

      if (null === value) return;

      this.cities = null;
      this.service.fetchCities(this.countries?.get(this.countryDropdown.value ?? '') ?? '', this.searchBarInput.value ?? '').subscribe();
    });

    this.service.getCountriesSearchList$().subscribe(countries => {
      this.countries = countries;
    });
    this.countries = null;

    this.service.getCities$().subscribe(cities => {
      this.cities = [];
      for (const city of cities) {
        this.cities.push(city);
      }
    });

    this.service.getPageCount$().subscribe(pageCount => {
      this.pageCount = pageCount;
    });

    this.service.fetchCountriesList('').subscribe();
  }

  protected onPageClick(pageIndex: number): void {
    console.log('cities.ts: clicked on page index = ' + pageIndex);
    this.service.fetchPage(this.countries?.get(this.countryDropdown.value ?? '') ?? '', pageIndex, this.searchBarInput.value ?? '').subscribe();
  }

  protected onSearchBarInputChange() {
    console.log('cities.ts: new search bar input = \"' + (this.searchBarInput.value ?? '') + '\"');

    if (this.countryDropdown.value == null) return;

    this.service.fetchCities(this.countries?.get(this.countryDropdown.value ?? '') ?? '', this.searchBarInput.value ?? '').subscribe();
  }

  protected onDropdownInputChange(input: string) {
    console.log('cities.ts: new dropdown input = \"' + input + '\"');

    this.countries = null;
    this.service.fetchCountriesList(input).subscribe();
  }
}
