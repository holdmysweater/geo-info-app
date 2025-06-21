import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable()
export class PaginationService {
  private readonly _currentPage: WritableSignal<number> = signal(0);
  private readonly _totalPages: WritableSignal<number> = signal(0);

  public readonly currentPage: Signal<number> = this._currentPage.asReadonly();
  public readonly totalPages: Signal<number> = this._totalPages.asReadonly();

  public updateCurrentPage(pageNumber: number): void {
    if (pageNumber < 0) return;

    this._currentPage.set(pageNumber);
  }

  public updateTotalPages(totalPages: number): void {
    this._totalPages.set(totalPages);

    if (0 !== this.totalPages() && this.currentPage() >= totalPages) {
      this._currentPage.set(totalPages - 1);
    }
  }
}

