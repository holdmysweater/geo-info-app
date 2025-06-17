import { Component } from '@angular/core';
import { CitiesService } from '../../services/cities.service';
import { PopulatedPlaceSummary } from '../../models/city.model';
import { CitiesTable } from '../../components/cities-table/cities-table';
import {
  TuiTextfieldComponent,
  TuiTextfieldDirective,
  TuiTextfieldDropdownDirective,
  TuiTextfieldOptionsDirective
} from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiChevron,
  TuiComboBox,
  TuiDataListWrapperComponent,
  TuiPagination,
  TuiTab,
  TuiTabsHorizontal
} from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';
import { CountryData } from '../../../countries/models/country.model';

@Component({
  selector: 'app-cities-list',
  imports: [
    CitiesTable,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    TuiTextfieldDirective,
    FormsModule,
    ReactiveFormsModule,
    TuiPagination,
    TuiTab,
    TuiTabsHorizontal,
    RouterLink,
    TuiChevron,
    TuiComboBox,
    TuiDataListWrapperComponent,
    TuiTextfieldDropdownDirective
  ],
  templateUrl: './cities-list.html',
  styleUrl: './cities-list.css'
})
export class CitiesList {
  protected countryDropdown: FormControl<string | null> = new FormControl('');
  protected countries: CountryData[] = [];
  protected cities: PopulatedPlaceSummary[] = [];
  protected pageCount: number = 1;
  protected searchBarInput: FormControl<string | null> = new FormControl('');
  protected readonly navTabsOptions: string[] = ['/countries', '/cities'];

  constructor(private service: CitiesService) {
  }

  private ngOnInit(): void {
    this.service.getCountriesSearchList$().subscribe(countries =>
      this.countries = countries
    )

    this.service.getCities$().subscribe(cities => {
      this.cities = [];
      for (const city of cities) {
        this.cities.push(city);
      }
    });

    this.service.getPageCount$().subscribe(pageCount => {
      this.pageCount = pageCount;
    });

    this.service.fetchCountriesList(this.countryDropdown.value ?? '', 10).subscribe();
    this.service.fetchCities(this.searchBarInput.value ?? '').subscribe();
  }

  protected onPageClick(pageIndex: number): void {
    console.log('cities-list.ts: clicked on page index = ' + pageIndex);
    this.service.fetchPage(this.countryDropdown.value ?? '', pageIndex, this.searchBarInput.value ?? '').subscribe();
  }

  protected onSearchBarInputChange() {
    console.log('cities-list.ts: new search bar input = \"' + (this.searchBarInput.value ?? '') + '\"');
    this.service.fetchCities(this.countryDropdown.value ?? '', this.searchBarInput.value ?? '').subscribe();
  }

  protected onDropdownChange() {
    if (this.countryDropdown.value ?? '' === '') return;

    console.log('cities-list.ts: new dropdown input = \"' + (this.countryDropdown.value ?? '') + '\"');
    this.service.fetchCities(this.countryDropdown.value ?? '', this.searchBarInput.value ?? '').subscribe();
  }
}
