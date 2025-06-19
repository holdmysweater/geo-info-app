import { Component, computed, effect, inject, input, InputSignal, Signal } from '@angular/core';
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

  protected isLoading: boolean = false;
  protected readonly cities: Signal<PopulatedPlaceSummary[]> = this.citiesService.cities;

  constructor() {
    // Update cities list
    effect(() => {
      this.isLoading = true;

      this.citiesService.fetchPage(
        this.countryWikiIdParameter() ?? '',
        this.paginationService.params().currentPage,
        this.searchParameters(),
        this.internationalizationService.language()
      ).subscribe();
    });

    // Reset loading flag after cities update
    effect(() => {
      this.cities();
      this.isLoading = false;
    });

    // Update total page count for pagination component
    effect(() => {
      this.paginationService.updateTotalPages(this.citiesService.pageCount());
    });
  }
}
