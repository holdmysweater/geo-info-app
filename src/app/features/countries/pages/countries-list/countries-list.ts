import { Component } from '@angular/core';
import { SearchBar } from '../../../../shared/components/search-bar/search-bar';
import { NavTabs } from '../../../../shared/components/nav-tabs/nav-tabs';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-countries-list',
  imports: [
    SearchBar,
    NavTabs,
    Pagination
  ],
  templateUrl: './countries-list.html',
  styleUrl: './countries-list.css'
})
export class CountriesList {

}
