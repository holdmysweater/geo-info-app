import { Component, input } from '@angular/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh } from '@taiga-ui/addon-table';
import { PopulatedPlaceSummary } from '../../models/city.model';

@Component({
  selector: 'app-cities-table',
  imports: [
    TuiTableDirective,
    TuiTableTbody,
    TuiTableTd,
    TuiTableTh
  ],
  templateUrl: './cities-table.component.html',
  styleUrl: './cities-table.component.css'
})
export class CitiesTableComponent {
  public cities = input<PopulatedPlaceSummary[]>();
}
