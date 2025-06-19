import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { PaginationParams } from '../models/pagination.model';

@Injectable()
export class PaginationService {
  private readonly _params: WritableSignal<PaginationParams> = signal({ currentPage: 0, totalPages: 0 });

  public readonly params: Signal<PaginationParams> = this._params.asReadonly();

  public updateCurrentPage(pageNumber: number): void {
    this._params.update(current => ({ ...current, currentPage: pageNumber }));
  }

  public updateTotalPages(totalPages: number): void {
    this._params.update(current => ({ ...current, totalPages: totalPages }));
  }
}

