import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompteComponent } from './compte/compte.component';
import { HistoriqueComponent } from './historique/historique.component';
import { DonneesComponent } from './donnees/donnees.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  { path: 'compte', component: CompteComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'donnees', component: DonneesComponent },
  { path: 'mainPage', component: MainPageComponent },
  { path: '', redirectTo: '/mainPage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
