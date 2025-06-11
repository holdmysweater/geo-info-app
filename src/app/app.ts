import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiCardLarge } from '@taiga-ui/layout';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, TuiCardLarge, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}
