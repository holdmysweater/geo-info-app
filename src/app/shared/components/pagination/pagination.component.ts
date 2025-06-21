import { Component, computed, effect, inject, Signal } from '@angular/core';
import { TuiPagination } from '@taiga-ui/kit';
import { PaginationService } from '../../services/pagination.service';
import { QueryParametersService } from '../../services/query-parameters.service';

@Component({
  selector: 'app-pagination',
  imports: [
    TuiPagination
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  private readonly paginationService: PaginationService = inject(PaginationService);
  private readonly queryParamsService: QueryParametersService = inject(QueryParametersService);

  protected readonly currentPage: Signal<number> = computed(() => this.paginationService.params().currentPage);
  protected readonly totalPages: Signal<number> = computed(() => this.paginationService.params().totalPages);

  constructor() {
    // Set current page from query params
    this.queryParamsService.watchParam('page').subscribe(value => {
      let page = Number(value);
      if (isNaN(page) || page < 1) return;
      this.paginationService.updateCurrentPage(page - 1);
    });

    // Update query params to match pagination page
    effect(() => {
      this.queryParamsService.update({
        page: this.paginationService.params().currentPage + 1
      }).then();
    });
  }

  protected onClick(pageIndex: number): void {
    this.paginationService.updateCurrentPage(pageIndex);
  }
}
