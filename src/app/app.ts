import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiCardLarge } from '@taiga-ui/layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, TuiCardLarge],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'geo-info-app';
}
