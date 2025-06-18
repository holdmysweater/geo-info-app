import { Component, input } from '@angular/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh } from "@taiga-ui/addon-table";
import { FormsModule } from '@angular/forms';
import { CountrySummary } from '../../models/country.model';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-countries-table',
  imports: [
    TuiTableDirective,
    TuiTableTh,
    TuiTableTbody,
    FormsModule,
    TuiTableTd,
    TuiIcon,
    RouterLink
  ],
  templateUrl: './countries-table.component.html',
  styleUrl: './countries-table.component.css'
})
export class CountriesTableComponent {
  public countries = input<CountrySummary[]>();
}
