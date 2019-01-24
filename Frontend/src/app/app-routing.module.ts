import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { HistoryComponent } from './history/history.component';
import { DataComponent } from './data/data.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'data', component: DataComponent },
  { path: 'mainPage', component: MainPageComponent },
  { path: '', redirectTo: '/mainPage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
