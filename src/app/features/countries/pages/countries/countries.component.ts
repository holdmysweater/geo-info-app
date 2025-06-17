import { Component } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { CountriesTableComponent } from '../../components/countries-table/countries-table.component';
import { CountrySummary } from '../../models/country.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-countries',
  imports: [
    CountriesTableComponent,
    FormsModule,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective,
    ReactiveFormsModule,
    TuiPagination
  ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css'
})
export class CountriesComponent {
  protected countries: CountrySummary[] = [];
  protected pageCount: number = 1;
  protected searchBarInput: FormControl<string | null> = new FormControl('');

  constructor(private service: CountriesService) {
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

    this.service.fetchCountries(this.searchBarInput.value ?? '').subscribe();
  }

  protected onPageClick(pageIndex: number): void {
    console.log('countries.component.ts: clicked on page index = ' + pageIndex);
    this.service.fetchPage(pageIndex, this.searchBarInput.value ?? '').subscribe();
  }

  protected onSearchBarInputChange() {
    console.log('countries.component.ts: new search bar input = \"' + (this.searchBarInput.value ?? '') + '\"');
    this.service.fetchCountries(this.searchBarInput.value ?? '').subscribe();
  }
}
