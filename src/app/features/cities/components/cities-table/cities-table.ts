import { Component, input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh } from '@taiga-ui/addon-table';
import { PopulatedPlaceSummary } from '../../models/city.model';

@Component({
  selector: 'app-cities-table',
  imports: [
    TuiIcon,
    TuiTableDirective,
    TuiTableTbody,
    TuiTableTd,
    TuiTableTh
  ],
  templateUrl: './cities-table.html',
  styleUrl: './cities-table.css'
})
export class CitiesTable {
  public cities = input<PopulatedPlaceSummary[]>();
}
