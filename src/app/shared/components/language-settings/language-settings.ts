import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-settings',
  imports: [
    FormsModule
  ],
  templateUrl: './language-settings.html',
  styleUrl: './language-settings.css'
})
export class LanguageSettings {
  protected language: string = "ru";

}
