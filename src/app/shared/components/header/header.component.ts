import { Component } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';
import { LanguageSettingsComponent } from '../language-settings/language-settings.component';
import { translateSignal } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  imports: [
    TuiTitle,
    LanguageSettingsComponent
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  protected title = translateSignal('header.title');
}
