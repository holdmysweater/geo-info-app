import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TuiTab, TuiTabsHorizontal } from "@taiga-ui/kit";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { translateSignal } from '@jsverse/transloco';
import { InternationalizationService } from '../../services/internationalization.service';

@Component({
  selector: 'app-nav-tabs',
  imports: [
    TuiTab,
    RouterLink,
    RouterLinkActive,
    TuiTabsHorizontal
  ],
  templateUrl: './nav-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavTabsComponent {
  protected readonly langService: InternationalizationService = inject(InternationalizationService);

  protected readonly tabs = [
    { url: 'countries', label: translateSignal('navigation.countries') },
    { url: 'cities', label: translateSignal('navigation.cities') }
  ];
}
