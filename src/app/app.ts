import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavTabsComponent } from './shared/components/nav-tabs/nav-tabs.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, HeaderComponent, NavTabsComponent],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {

}
