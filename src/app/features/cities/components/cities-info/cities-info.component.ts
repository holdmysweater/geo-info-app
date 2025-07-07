import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/legacy';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { PopulatedPlaceSummary } from '../../models/city.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cities-info',
  standalone: true,
  imports: [
    FormsModule,
    TuiInputModule,
    TuiButton,
    TranslocoDirective,
    DatePipe
  ],
  templateUrl: './cities-info.component.html',
  styleUrl: './cities-info.component.less'
})
export class CitiesInfoComponent {
  public readonly context: TuiDialogContext<void, PopulatedPlaceSummary> = injectContext();

  protected get city(): PopulatedPlaceSummary {
    return this.context.data;
  }

  protected closeDialog(): void {
    this.context.completeWith();
  }
}
