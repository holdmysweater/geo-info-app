import { Routes } from '@angular/router';
import { CountriesComponent } from './features/countries/pages/countries/countries.component';
import { CitiesList } from './features/cities/pages/cities-list/cities-list';

export const routes: Routes = [
  { path: '', redirectTo: '/countries', pathMatch: 'full' },
  { path: 'countries', component: CountriesComponent },
  { path: 'cities', component: CitiesList },
];
