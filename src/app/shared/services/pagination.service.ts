import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable()
export class PaginationService {
  // region CURRENT PAGE

  private readonly _currentPage: WritableSignal<number> = signal(0);

  public readonly currentPage: Signal<number> = this._currentPage.asReadonly();

  public setCurrentPage(pageNumber: number): void {
    if (pageNumber < 0) return;

    this._currentPage.set(pageNumber);
  }

  // endregion

  // region TOTAL PAGES
  
  private readonly _totalPages: WritableSignal<number> = signal(0);

  public readonly totalPages: Signal<number> = this._totalPages.asReadonly();

  public setTotalPages(totalPages: number): void {
    if (totalPages < 0) return;

    this._totalPages.set(totalPages);

    if (0 !== this.totalPages() && this.currentPage() >= totalPages) {
      this._currentPage.set(totalPages - 1);
    }
  }

  // endregion
}

