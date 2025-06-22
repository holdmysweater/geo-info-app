import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
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
  styleUrl: './nav-tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTabsComponent {
  private readonly internationalizationService: InternationalizationService = inject(InternationalizationService);

  protected readonly language: Signal<string> = this.internationalizationService.language;

  protected readonly tabs = [
    { url: 'countries', label: translateSignal('navigation.countries') },
    { url: 'cities', label: translateSignal('navigation.cities') }
  ];
}
