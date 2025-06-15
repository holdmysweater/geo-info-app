import { Component, input } from '@angular/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTh } from "@taiga-ui/addon-table";
import { FormsModule } from '@angular/forms';
import { CountryDetail } from '../../models/country.model';

@Component({
  selector: 'app-countries-table',
  imports: [
    TuiTableDirective,
    TuiTableTh,
    TuiTableTbody,
    FormsModule
  ],
  templateUrl: './countries-table.html',
  styleUrl: './countries-table.css'
})
export class CountriesTable {
  public countries = input<CountryDetail[]>();
}
