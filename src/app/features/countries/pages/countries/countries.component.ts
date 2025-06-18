import { Component, computed, effect, inject } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { CountriesTableComponent } from '../../components/countries-table/countries-table.component';
import { CountrySummary } from '../../models/country.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-countries',
  imports: [
    CountriesTableComponent,
    FormsModule,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective,
    ReactiveFormsModule,
    PaginationComponent
  ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css',
  providers: [PaginationService]
})
export class CountriesComponent {
  private readonly paginationService: PaginationService = inject(PaginationService);

  protected currentPageIndex = computed(() => this.paginationService.params().currentPage);
  protected countries: CountrySummary[] = [];
  protected searchBarInput: FormControl<string | null> = new FormControl('');

  constructor(private service: CountriesService) {
    effect(() => {
      this.service.fetchPage(this.currentPageIndex(), this.searchBarInput.value ?? '').subscribe();
      console.log("effect");
    });
  }

  private ngOnInit(): void {
    this.service.getCountries$().subscribe(countries => {
      this.countries = [];
      for (const country of countries) {
        this.countries.push(country);
      }
    });

    this.service.getPageCount$().subscribe(pageCount => {
      this.paginationService.updateTotalPages(pageCount);
    });

    this.service.fetchCountries(this.searchBarInput.value ?? '').subscribe();
  }

  protected onSearchBarInputChange() {
    console.log('countries.component.ts: new search bar input = \"' + (this.searchBarInput.value ?? '') + '\"');
    this.service.fetchCountries(this.searchBarInput.value ?? '').subscribe();
  }
}
