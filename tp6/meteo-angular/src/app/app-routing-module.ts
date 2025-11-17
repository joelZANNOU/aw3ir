import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Meteo } from './meteo/meteo';
import { MeteoDetail } from './meteo-detail/meteo-detail';

//const routes: Routes = [];

const routes: Routes = [
  { path: '', component: Meteo },
  { path: 'meteo/:name', component: MeteoDetail },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
