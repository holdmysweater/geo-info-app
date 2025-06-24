import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/legacy';
import { TuiButton, TuiDialogContext, TuiLoader } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { CityDetails } from '../../models/city.model';
import { CitiesService } from '../../services/cities.service';
import { InternationalizationService } from '../../../../shared/services/internationalization.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cities-info',
  standalone: true,
  imports: [
    FormsModule,
    TuiInputModule,
    TuiButton,
    TuiLoader,
    TranslocoDirective,
    DatePipe
  ],
  templateUrl: './cities-info.component.html',
  styleUrl: './cities-info.component.less'
})
export class CitiesInfoComponent {
  private readonly citiesService: CitiesService = inject(CitiesService);
  private readonly langService: InternationalizationService = inject(InternationalizationService);

  public readonly context: TuiDialogContext<void, string> = injectContext<TuiDialogContext<void, string>>();

  protected readonly isLoading: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly cityDetails: WritableSignal<CityDetails | undefined> = signal<CityDetails | undefined>(undefined);

  constructor() {
    this.loadCityDetails();
  }

  private loadCityDetails(): void {
    this.isLoading.set(true);
    this.citiesService.fetchCityDetails(this.context.data ?? '', this.langService.language()).subscribe({
      next: (city: CityDetails) => {
        const updatedCity: CityDetails = {
          ...city,
          dateOfFoundation: city.dateOfFoundation ?? null
        };
        this.cityDetails.set(updatedCity);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  protected closeDialog(): void {
    this.context.completeWith();
  }
}
