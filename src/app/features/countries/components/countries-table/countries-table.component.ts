import { Component, effect, inject, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
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
  providers: [CountriesService]
})
export class CountriesTableComponent {
  private readonly countriesService: CountriesService = inject(CountriesService);
  private readonly paginationService: PaginationService = inject(PaginationService);
  protected readonly langService: InternationalizationService = inject(InternationalizationService);

  public readonly searchParameters: InputSignal<string> = input<string>('');

  protected readonly isLoading: WritableSignal<boolean> = signal(true);
  protected readonly countries: Signal<CountrySummary[]> = this.countriesService.countries;

  constructor() {
    // Update countries list
    effect(() => {
      this.isLoading.set(true);

      this.countriesService.fetchPage(
        this.paginationService.currentPage(),
        this.searchParameters(),
        this.langService.language()
      ).subscribe({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false)
      });
    });

    // Update total page count in pagination service
    effect(() => {
      this.paginationService.setTotalPages(this.countriesService.pageCount());
    });
  }
}
