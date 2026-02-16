import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profil } from './profil/profil';
import { Kosar } from './kosar/kosar';
import { Foglalas } from './foglalas/foglalas';
import { Aszf } from './aszf/aszf';
import { Adatvedelem } from './adatvedelem/adatvedelem';
import { Termekek } from './termekek/termekek';

const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'profil', component: Profil },
  { path: 'kosar', component: Kosar },
  { path: 'foglalas', component: Foglalas },
  { path: 'aszf', component: Aszf },
  { path: 'adatvedelem', component: Adatvedelem },
  { path: 'termekek', component: Termekek }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

