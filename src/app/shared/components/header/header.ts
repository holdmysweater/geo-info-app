import { Component } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { LanguageSettings } from '../language-settings/language-settings.component';

@Component({
  selector: 'app-header',
  imports: [
    TuiTitle,
    LanguageSettings
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  protected title = 'ГЕОИНФОРМАЦИЯ';
}
