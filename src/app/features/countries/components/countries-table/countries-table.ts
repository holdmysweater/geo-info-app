import { Component } from '@angular/core';
import { TuiTableDirective, TuiTableTbody, TuiTableTh } from "@taiga-ui/addon-table";
import { FormsModule } from '@angular/forms';

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

}
