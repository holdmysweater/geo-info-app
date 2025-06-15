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
  public onInputChange = output<string>();

  protected value: string | undefined;

  protected onValueChanged(): void {
    console.log('search-bar.ts: new value is \"' + this.value + '\"');
    this.onInputChange.emit(this.value!);
  }
}
