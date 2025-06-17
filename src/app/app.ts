import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiCardLarge } from '@taiga-ui/layout';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, TuiCardLarge, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
