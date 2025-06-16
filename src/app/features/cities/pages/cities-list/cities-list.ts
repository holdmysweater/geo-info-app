import { Component } from '@angular/core';
import { Cities } from '../../services/cities';
import { PopulatedPlaceSummary } from '../../models/city.model';
import { Countries } from '../../../countries/services/countries';
import { CitiesTable } from '../../components/cities-table/cities-table';
import { TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiPagination, TuiTab, TuiTabsHorizontal } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';

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
    RouterLink
  ],
  templateUrl: './cities-list.html',
  styleUrl: './cities-list.css'
})
export class CitiesList {
  protected wikiId: string = '';
  protected countries: string[] = [];
  protected cities: PopulatedPlaceSummary[] = [];
  protected pageCount: number = 1;
  protected searchBarInput: FormControl<string | null> = new FormControl('');
  protected readonly navTabsOptions: string[] = ['/countries', '/cities'];

  constructor(private service: Cities, private countryService: Countries) {
  }

  private ngOnInit(): void {
    this.countryService.getCountries$().subscribe((countries) => {
      this.countries = [];
      for (const country of countries) {
        this.countries.push(country.name);
      }
    })

    this.service.getCities$().subscribe(cities => {
      this.cities = [];
      for (const city of cities) {
        this.cities.push(city);
      }
    });

    this.service.getPageCount$().subscribe(pageCount => {
      this.pageCount = pageCount;
    });

    this.countryService.getCountries$().subscribe();
    this.service.fetchCities(this.searchBarInput.value ?? '').subscribe();
  }

  protected onPageClick(pageIndex: number): void {
    console.log('cities-list.ts: clicked on page index = ' + pageIndex);
    this.service.fetchPage(this.wikiId, pageIndex, this.searchBarInput.value ?? '').subscribe();
  }

  protected onSearchBarInputChange() {
    console.log('cities-list.ts: new search bar input = \"' + (this.searchBarInput.value ?? '') + '\"');
    this.service.fetchCities(this.wikiId, this.searchBarInput.value ?? '').subscribe();
  }
}
