import { Component, effect, inject, input, InputSignal } from '@angular/core';
import { CountriesTableComponent } from '../../components/countries-table/countries-table.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiTextfieldComponent, TuiTextfieldDirective, TuiTextfieldOptionsDirective } from '@taiga-ui/core';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { QueryParametersService } from '../../../../shared/services/query-parameters.service';

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
  styleUrl: './countries.component.less',
  providers: [PaginationService]
})
export class CountriesComponent {
  private readonly queryParamsService: QueryParametersService = inject(QueryParametersService);

  protected searchParam: InputSignal<string> = input('', { alias: 'search' });

  protected readonly searchFormControl: FormControl<string | null> = new FormControl('');

  constructor() {
    // Update search - URL to Input
    effect(() => {
      if ('' === this.searchParam()) return;
      this.searchFormControl.setValue(this.searchParam(), { emitEvent: false });
      this.queryParamsService.update({
        search: this.searchParam(),
      }).then();
    });

    // Update search - Input to URL
    this.searchFormControl.valueChanges.subscribe(value => {
      this.queryParamsService.update({
        search: value,
        page: 1
      }).then();
    });
  }
}
