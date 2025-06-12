import { Component } from '@angular/core';
import { TuiTab, TuiTabsHorizontal } from '@taiga-ui/kit';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-tabs',
  imports: [
    TuiTabsHorizontal,
    TuiTab,
    RouterLink
  ],
  templateUrl: './nav-tabs.html',
  styleUrl: './nav-tabs.css'
})
export class NavTabs {
  protected readonly options: string[] = ['/countries', '/cities'];
  protected activeItemIndex: number = 0;

  protected onClick(item: string): void {
    console.log('nav-tabs.ts: clicked on \"' + item + '\"');
  }
}
