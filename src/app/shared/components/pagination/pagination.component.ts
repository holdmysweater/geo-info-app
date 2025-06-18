import { Component, computed, inject, Signal } from '@angular/core';
import { TuiPagination } from '@taiga-ui/kit';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-pagination',
  imports: [
    TuiPagination
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  private readonly service: PaginationService = inject(PaginationService);

  protected readonly currentPage: Signal<number> = computed(() => this.service.params().currentPage);
  protected readonly totalPages: Signal<number> = computed(() => this.service.params().totalPages);

  protected onClick(pageIndex: number): void {
    this.service.updateCurrentPage(pageIndex);
  }
}
