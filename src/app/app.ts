import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiCardLarge } from '@taiga-ui/layout';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavTabsComponent } from './shared/components/nav-tabs/nav-tabs.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, TuiCardLarge, HeaderComponent, NavTabsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
