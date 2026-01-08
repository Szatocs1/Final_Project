import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profil } from './profil/profil';
import { Kosar } from './kosar/kosar';

const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'profil', component: Profil },
  { path: 'kosar', component: Kosar },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

