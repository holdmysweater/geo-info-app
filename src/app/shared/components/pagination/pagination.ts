import { Component, input, output } from '@angular/core';
import { TuiPagination } from '@taiga-ui/kit';

@Component({
  selector: 'app-pagination',
  imports: [
    TuiPagination
  ],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {
  public index = input<number>();
  public length = input<number>();
  public onPageClick = output<number>();

  protected onClick(pageIndex: number): void {
    console.log('pagination.ts: clicked on \"' + pageIndex + '\"');
    this.onPageClick.emit(pageIndex);
  }
}
