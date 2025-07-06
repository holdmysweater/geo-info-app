import { Component, effect, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiRadioList } from '@taiga-ui/kit';
import { InternationalizationService } from '../../services/internationalization.service';
import { QueryParametersService } from '../../services/query-parameters.service';

@Component({
  selector: 'app-language-settings',
  imports: [
    FormsModule,
    TuiRadioList,
    ReactiveFormsModule
  ],
  templateUrl: './language-settings.component.html'
})
export class LanguageSettingsComponent {
  protected readonly langService: InternationalizationService = inject(InternationalizationService);
  private readonly queryService: QueryParametersService = inject(QueryParametersService);

  protected readonly languageFormControl: FormControl<string | null> = new FormControl('');

  constructor() {
    // Update language - Service to Input
    effect(() => {
      this.languageFormControl.setValue(this.langService.language(), { emitEvent: false });
    });

    // Update language - URL to Service
    this.queryService.watchParam('lang').subscribe((value: string | null) => {
      this.langService.setLanguage(value ?? '');
    });

    // Update language - Service to URL
    this.languageFormControl.valueChanges.subscribe((value: string | null) => {
      console.log('language-settings.component.ts: changed value to \"' + value + '\"');

      this.langService.setLanguage(value ?? '');
      this.queryService.update({
        lang: this.langService.language()
      }).then();
    });
  }
}
