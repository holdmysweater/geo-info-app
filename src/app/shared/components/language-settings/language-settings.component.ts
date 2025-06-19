import { Component, effect, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiRadioList } from '@taiga-ui/kit';
import { InternationalizationService } from '../../services/internationalization.service';

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
  private readonly service: InternationalizationService = inject(InternationalizationService);

  protected readonly languageFormControl = new FormControl('');
  protected readonly options: readonly string[] = this.service.getOptions();

  private readonly language = this.service.language;

  constructor() {
    effect(() => {
      this.languageFormControl.setValue(this.language());
    });
  }

  protected onValueChanged(): void {
    console.log('language-settings.component.ts: changed value to \"' + this.languageFormControl.value + '\"');

    this.service.setLanguage(this.languageFormControl.value ?? '');
  }
}
