import { Routes } from '@angular/router';
import { CountriesList } from './features/countries/pages/countries-list/countries-list';

export const routes: Routes = [
  { path: '', redirectTo: '/countries', pathMatch: 'full' },
  { path: 'countries', component: CountriesList },
];
