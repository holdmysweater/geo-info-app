import { Component, effect, inject, input, InputSignal, Signal } from '@angular/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh } from "@taiga-ui/addon-table";
import { FormsModule } from '@angular/forms';
import { CountrySummary } from '../../models/country.model';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { InternationalizationService } from '../../../../shared/services/internationalization.service';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-countries-table',
  imports: [
    TuiTableDirective,
    TuiTableTh,
    TuiTableTbody,
    FormsModule,
    TuiTableTd,
    TuiIcon,
    RouterLink,
    TranslocoDirective,
    TuiLoader
  ],
  templateUrl: './countries-table.component.html',
  styleUrl: './countries-table.component.css'
})
export class CountriesTableComponent {
  public searchParameters: InputSignal<string | undefined> = input<string>();

  private readonly countriesService: CountriesService = inject(CountriesService);
  private readonly paginationService: PaginationService = inject(PaginationService);
  protected readonly internationalizationService: InternationalizationService = inject(InternationalizationService);

  protected isLoading: boolean = true;
  protected readonly countries: Signal<CountrySummary[]> = this.countriesService.countries;

  constructor() {
    // Update countries list
    effect(() => {
      this.isLoading = true;
      this.countriesService.fetchPage(
        this.paginationService.currentPage(),
        this.searchParameters(),
        this.internationalizationService.language()
      ).subscribe();
    });

    // Reset loading flag after countries update
    effect(() => {
      this.countries();
      this.isLoading = false;
    });

    // Update total page count
    effect(() => {
      this.paginationService.setTotalPages(this.countriesService.pageCount());
    });
  }
}
