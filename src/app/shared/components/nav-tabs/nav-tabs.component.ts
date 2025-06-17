import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiTab, TuiTabsHorizontal } from "@taiga-ui/kit";
import { RouterLink, RouterLinkActive } from "@angular/router";

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
  protected readonly tabs = [
    { url: 'countries', label: 'Страны' },
    { url: 'cities', label: 'Города' }
  ];
}
