import { Component, input } from '@angular/core';
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

}
