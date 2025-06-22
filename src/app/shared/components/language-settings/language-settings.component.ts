import { Component, effect, inject, Signal } from '@angular/core';
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
  templateUrl: './language-settings.component.html',
  styleUrl: './language-settings.component.css'
})
export class LanguageSettings {
  private readonly internationalizationService: InternationalizationService = inject(InternationalizationService);
  private readonly queryParamsService: QueryParametersService = inject(QueryParametersService);

  protected readonly languageFormControl: FormControl<string | null> = new FormControl('');
  protected readonly options: readonly string[] = this.internationalizationService.getOptions();

  private readonly language: Signal<string> = this.internationalizationService.language;

  constructor() {
    effect(() => {
      this.languageFormControl.setValue(this.language(), { emitEvent: false });
    });

    this.queryParamsService.watchParam('lang').subscribe(value => {
      this.internationalizationService.setLanguage(value ?? '');
    });

    this.languageFormControl.valueChanges.subscribe(value => {
      console.log('language-settings.component.ts: changed value to \"' + this.languageFormControl.value + '\"');

      this.internationalizationService.setLanguage(this.languageFormControl.value ?? '');
      this.queryParamsService.update({
        lang: this.language()
      }).then();
    });
  }
}
