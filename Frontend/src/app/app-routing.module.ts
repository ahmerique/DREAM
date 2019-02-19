import { NgModule } from '@angular/core';
import { AuthGuard } from './_guards';
import { AuthGuard2 } from './_guards';

import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { HistoryComponent } from './history/history.component';
import { DataComponent } from './data/data.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { GuestComponent } from './guest/guest.component';

const routes: Routes = [
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'datas', component: DataComponent, canActivate: [AuthGuard] },

  { path: 'datas/:id', component: DataComponent, canActivate: [AuthGuard] },
  { path: 'mainPage/:id', component: MainPageComponent, canActivate: [AuthGuard2] },
  { path: 'mainPage', component: MainPageComponent, canActivate: [AuthGuard] },

  { path: 'guest', component: GuestComponent },
  { path: 'guest/:id', component: GuestComponent },

  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/mainPage', pathMatch: 'full' },
  { path: 'en', redirectTo: '/mainPage/en', pathMatch: 'full' },

  { path: '**', redirectTo: '/mainPage', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
