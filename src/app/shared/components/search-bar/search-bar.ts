import { Component, output } from '@angular/core';
import { TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    FormsModule,
    TuiTextfieldOptionsDirective
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  public change = output<string>();

}
