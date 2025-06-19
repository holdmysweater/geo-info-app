import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { CountriesTableComponent } from '../../components/countries-table/countries-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiLoader, TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { CountrySummary } from '../../models/country.model';
import { InternationalizationService } from '../../../../shared/services/internationalization.service';

@Component({
  selector: 'app-countries',
  imports: [
    CountriesTableComponent,
    FormsModule,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective,
    ReactiveFormsModule,
    PaginationComponent,
    TuiLoader
  ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css',
  providers: [CountriesService, PaginationService]
})
export class CountriesComponent {
  private readonly service: CountriesService = inject(CountriesService);
  private readonly paginationService: PaginationService = inject(PaginationService);
  private readonly internationalizationService: InternationalizationService = inject(InternationalizationService);

  protected isLoading: boolean = true;
  protected readonly countries: Signal<CountrySummary[]> = this.service.countries;

  protected readonly totalPageCount: Signal<number> = this.service.pageCount;
  protected readonly currentPageIndex: Signal<number> = computed(() =>
    this.paginationService.params().currentPage
  );

  protected readonly searchBarInput: WritableSignal<string> = signal('');

  constructor() {
    // Update countries list
    effect(() => {
      this.isLoading = true;
      this.service.fetchPage(
        this.currentPageIndex(),
        this.searchBarInput(),
        this.internationalizationService.language()
      ).subscribe();
    });

    effect(() => {
      this.countries();
      this.isLoading = false;
    });

    // Update total page count for pagination component
    effect(() => {
      this.paginationService.updateTotalPages(this.totalPageCount());
    });
  }

  protected onSearchBarInputChange(text: string) {
    console.log('countries.component.ts: new search bar input = \"' + (text ?? '') + '\"');
    this.searchBarInput.set(text);
  }
}
