import { Component } from '@angular/core';
import { TuiTitle } from '@taiga-ui/core';

@Component({
  selector: 'app-header',
  imports: [
    TuiTitle
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  protected title = 'ГЕОИНФОРМАЦИЯ';
}
