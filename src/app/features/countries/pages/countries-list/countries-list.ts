import { Component } from '@angular/core';
import { SearchBar } from '../../../../shared/components/search-bar/search-bar';
import { NavTabs } from '../../../../shared/components/nav-tabs/nav-tabs';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Countries } from '../../services/countries';
import { CountriesTable } from '../../components/countries-table/countries-table';

@Component({
  selector: 'app-countries-list',
  imports: [
    SearchBar,
    NavTabs,
    Pagination,
    CountriesTable
  ],
  templateUrl: './countries-list.html',
  styleUrl: './countries-list.css'
})
export class CountriesList {
  protected countries: string[] = [];
  protected pageCount: number = 1;

  constructor(private service: Countries) {
  }

  private ngOnInit(): void {
    this.service.getCountries$().subscribe(countries => {
      this.countries = [];
      for (const country of countries) {
        this.countries.push(country.code);
      }
    });

    this.service.getPageCount$().subscribe(pageCount => {
      this.pageCount = pageCount;
    });

    this.service.fetchCountries().subscribe();
  }

  protected onPageClick(pageIndex: number): void {
    console.log('countries-list.ts: clicked on page index = ' + pageIndex);
    this.service.fetchPage(pageIndex).subscribe();
  }
}
