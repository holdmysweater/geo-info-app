import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiRadioList } from '@taiga-ui/kit';

@Component({
  selector: 'app-language-settings',
  imports: [
    FormsModule,
    TuiRadioList
  ],
  templateUrl: './language-settings.html',
  styleUrl: './language-settings.css'
})
export class LanguageSettings {
  protected language: string = "ru";

  protected onLanguageChange(): void {
    // TODO localization logic
    console.log('language-settings.ts: changed value to \"' + this.language + '\"');
  }
}
