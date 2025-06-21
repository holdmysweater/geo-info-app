import { Component, effect, inject, Signal } from '@angular/core';
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

  protected readonly currentPage: Signal<number> = this.paginationService.currentPage;
  protected readonly totalPages: Signal<number> = this.paginationService.totalPages;

  constructor() {
    // Set current page from query params
    this.queryParamsService.watchParam('page').subscribe(value => {
      this.paginationService.updateCurrentPage(Number(value) - 1);
    });

    // Update query params to match pagination page
    effect(() => {
      this.queryParamsService.update({
        page: this.currentPage() + 1
      }).then();
    });
  }

  protected onClick(pageIndex: number): void {
    this.paginationService.updateCurrentPage(pageIndex);
  }
}
