import { Component, input } from '@angular/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh } from "@taiga-ui/addon-table";
import { FormsModule } from '@angular/forms';
import { CountrySummary } from '../../models/country.model';

@Component({
  selector: 'app-countries-table',
  imports: [
    TuiTableDirective,
    TuiTableTh,
    TuiTableTbody,
    FormsModule,
    TuiTableTd
  ],
  templateUrl: './countries-table.html',
  styleUrl: './countries-table.css'
})
export class CountriesTable {
  public countries = input<CountrySummary[]>();
}
