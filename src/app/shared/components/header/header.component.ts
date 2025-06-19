import { Component } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { LanguageSettings } from '../language-settings/language-settings.component';
import { translateSignal } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  imports: [
    TuiTitle,
    LanguageSettings
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  protected title = translateSignal('header.title');
}
