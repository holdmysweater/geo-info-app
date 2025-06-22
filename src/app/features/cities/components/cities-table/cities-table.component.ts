import { Component, effect, inject, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh } from '@taiga-ui/addon-table';
import { PopulatedPlaceSummary } from '../../models/city.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { InternationalizationService } from '../../../../shared/services/internationalization.service';
import { CitiesService } from '../../services/cities.service';
import { TuiLoader } from '@taiga-ui/core';

@Component({
  selector: 'app-cities-table',
  imports: [
    TuiTableDirective,
    TuiTableTbody,
    TuiTableTd,
    TuiTableTh,
    TranslocoDirective,
    TuiLoader
  ],
  templateUrl: './cities-table.component.html',
  styleUrl: './cities-table.component.css'
})
export class CitiesTableComponent {
  public searchParameters: InputSignal<string> = input<string>('');
  public countryWikiIdParameter: InputSignal<string | null> = input<string | null>('');

  private readonly citiesService = inject(CitiesService);
  private readonly paginationService = inject(PaginationService);
  private readonly internationalizationService: InternationalizationService = inject(InternationalizationService);

  protected isLoading: WritableSignal<boolean> = signal(true);
  protected readonly cities: Signal<PopulatedPlaceSummary[]> = this.citiesService.cities;

  constructor() {
    // Update cities list
    effect(() => {
      this.isLoading.set(true);

      const sub = this.citiesService.fetchPage(
        this.countryWikiIdParameter() ?? '',
        this.paginationService.currentPage(),
        this.searchParameters(),
        this.internationalizationService.language()
      ).subscribe({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false)
      });

      return () => sub.unsubscribe();
    });

    // Update total page count for pagination component
    effect(() => {
      this.paginationService.setTotalPages(this.citiesService.pageCount());
    });
  }
}
