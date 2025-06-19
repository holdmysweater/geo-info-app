import { Component, signal, WritableSignal } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { CountriesTableComponent } from '../../components/countries-table/countries-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-countries',
  imports: [
    CountriesTableComponent,
    FormsModule,
    TuiTextfieldComponent,
    TuiTextfieldDirective,
    TuiTextfieldOptionsDirective,
    ReactiveFormsModule,
    PaginationComponent,
    TranslocoDirective
  ],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.css',
  providers: [CountriesService, PaginationService]
})
export class CountriesComponent {
  protected readonly searchBarInput: WritableSignal<string> = signal('');

  protected onSearchBarInputChange(text: string) {
    console.log('countries.component.ts: new search bar input = \"' + (text ?? '') + '\"');
    this.searchBarInput.set(text);
  }
}
