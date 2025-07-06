import { Component, effect, inject } from '@angular/core';
import { TuiPagination } from '@taiga-ui/kit';
import { PaginationService } from '../../services/pagination.service';
import { QueryParametersService } from '../../services/query-parameters.service';

@Component({
  selector: 'app-pagination',
  imports: [
    TuiPagination
  ],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  protected readonly paginationService: PaginationService = inject(PaginationService);
  private readonly queryService: QueryParametersService = inject(QueryParametersService);

  constructor() {
    // Update page - URL to Service
    this.queryService.watchParam('page').subscribe(value => {
      this.paginationService.setCurrentPage(Number(value) - 1);
    });

    // Update page - Service to URL
    effect(() => {
      this.queryService.update({
        page: this.paginationService.currentPage() + 1
      });
    });
  }
}
