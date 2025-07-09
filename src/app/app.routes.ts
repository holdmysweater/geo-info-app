import { Routes } from '@angular/router';
import { CountriesComponent } from './features/countries/components/countries/countries.component';
import { CitiesComponent } from './features/cities/components/cities/cities.component';

export const routes: Routes = [
  { path: '', redirectTo: '/countries', pathMatch: 'full' },
  { path: 'countries', component: CountriesComponent },
  { path: 'cities', component: CitiesComponent },
];
