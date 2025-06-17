import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiRadioList } from '@taiga-ui/kit';

@Component({
  selector: 'app-language-settings',
  imports: [
    FormsModule,
    TuiRadioList
  ],
  templateUrl: './language-settings.component.html',
  styleUrl: './language-settings.component.css'
})
export class LanguageSettings {
  public onLanguageChange = output<string>();

  protected readonly options: string[] = ['RU', 'EN'];
  protected language: string = this.options[0]!;

  protected onValueChanged(): void {
    console.log('language-settings.component.ts: changed value to \"' + this.language + '\"');
    this.onLanguageChange.emit(this.language);
  }
}
