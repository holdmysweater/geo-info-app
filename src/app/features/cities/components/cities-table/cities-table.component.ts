import { Component, effect, inject, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh } from '@taiga-ui/addon-table';
import { PopulatedPlaceSummary } from '../../models/city.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { InternationalizationService } from '../../../../shared/services/internationalization.service';
import { CitiesService } from '../../services/cities.service';
import { TuiButton, tuiDialog, TuiIcon, TuiLoader } from '@taiga-ui/core';
import { CitiesInfoComponent } from '../cities-info/cities-info.component';
import { CitiesFormComponent } from '../cities-form/cities-form.component';

@Component({
  selector: 'app-cities-table',
  imports: [
    TuiTableDirective,
    TuiTableTbody,
    TuiTableTd,
    TuiTableTh,
    TranslocoDirective,
    TuiLoader,
    TuiIcon,
    TuiButton
  ],
  templateUrl: './cities-table.component.html',
  providers: [CitiesService]
})
export class CitiesTableComponent {
  private readonly citiesService = inject(CitiesService);
  private readonly paginationService = inject(PaginationService);
  private readonly langService: InternationalizationService = inject(InternationalizationService);

  public searchParameters: InputSignal<string> = input<string>('');
  public countryWikiIdParameter: InputSignal<string | null> = input<string | null>('');

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
        this.langService.language()
      ).subscribe({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false)
      });

      return () => sub.unsubscribe();
    });

    // Update total page count in pagination service
    effect(() => {
      this.paginationService.setTotalPages(this.citiesService.pageCount());
    });
  }

  // region INFO DIALOG

  private readonly infoDialog = tuiDialog(CitiesInfoComponent, {
    dismissible: true,
    closeable: false,
    size: 's'
  });

  protected showInfoDialog(id: string): void {
    this.infoDialog(id).subscribe();
  }

  // endregion

  // region FORM DIALOG

  private readonly formDialog = tuiDialog(CitiesFormComponent, {
    dismissible: false,
    closeable: false,
    size: 'm'
  });

  protected showFormDialog(id: string): void {
    this.formDialog(id).subscribe();
  }

  // endregion
}
