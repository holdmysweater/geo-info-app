import { Component } from '@angular/core';
import { NavTabs } from '../../../../shared/components/nav-tabs/nav-tabs';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Countries } from '../../services/countries';
import { CountriesTable } from '../../components/countries-table/countries-table';
import { CountrySummary } from '../../models/country.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';

@Component({
  selector: 'app-countries-list',
  imports: [
    NavTabs,
    Pagination,
    CountriesTable,
    FormsModule,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective,
    ReactiveFormsModule
  ],
  templateUrl: './countries-list.html',
  styleUrl: './countries-list.css'
})
export class CountriesList {
  protected countries: CountrySummary[] = [];
  protected pageCount: number = 1;
  protected searchBarInput: string = '';

  constructor(private service: Countries) {
  }

  private ngOnInit(): void {
    this.service.getCountries$().subscribe(countries => {
      this.countries = [];
      for (const country of countries) {
        this.countries.push(country);
      }
    });

    this.service.getPageCount$().subscribe(pageCount => {
      this.pageCount = pageCount;
    });

    this.service.fetchCountries(this.searchBarInput).subscribe();
  }

  protected onPageClick(pageIndex: number): void {
    console.log('countries-list.ts: clicked on page index = ' + pageIndex);
    this.service.fetchPage(pageIndex, this.searchBarInput).subscribe();
  }

  protected onSearchBarInputChange(searchString: string) {
    console.log('countries-list.ts: new search bar input = \"' + searchString + '\"');
    this.searchBarInput = searchString;
    this.service.fetchCountries(this.searchBarInput).subscribe();
  }
}
