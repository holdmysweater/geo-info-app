import { Component } from '@angular/core';
import { NavTabs } from '../../../../shared/components/nav-tabs/nav-tabs';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Cities } from '../../services/cities';
import { PopulatedPlaceSummary } from '../../models/city.model';
import { Countries } from '../../../countries/services/countries';
import { CitiesTable } from '../../components/cities-table/cities-table';
import { TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';

@Component({
  selector: 'app-cities-list',
  imports: [
    NavTabs,
    Pagination,
    CitiesTable,
    TuiTextfieldComponent,
    TuiTextfieldOptionsDirective,
    TuiTextfieldDirective
  ],
  templateUrl: './cities-list.html',
  styleUrl: './cities-list.css'
})
export class CitiesList {
  protected wikiId: string = '';
  protected countries: string[] = [];
  protected cities: PopulatedPlaceSummary[] = [];
  protected pageCount: number = 1;
  protected searchBarInput: string = '';

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

    this.service.fetchCities(this.searchBarInput).subscribe();
  }

  protected onPageClick(pageIndex: number): void {
    console.log('cities-list.ts: clicked on page index = ' + pageIndex);
    this.service.fetchPage(this.wikiId, pageIndex, this.searchBarInput).subscribe();
  }

  protected onSearchBarInputChange(searchString: string) {
    console.log('cities-list.ts: new search bar input = \"' + searchString + '\"');
    this.searchBarInput = searchString;
    this.service.fetchCities(this.searchBarInput).subscribe();
  }
}
