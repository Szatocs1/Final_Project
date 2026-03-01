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
import { LoggedProfil } from './logged-profil/logged-profil';
import { AdminLogin } from './admin-login/admin-login';
import { Admin } from './admin/admin';
import { DeleteRendeles } from './delete-rendeles/delete-rendeles';
import { ModifyDeleteFoglalas } from './modify-delete-foglalas/modify-delete-foglalas';
import { BorbelyNaptar } from './borbely-naptar/borbely-naptar';

const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'logged-profil', component: LoggedProfil },
    { path: 'register', component: Register },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'profil', component: Profil },
    { path: 'kosar', component: Kosar },
    { path: 'foglalas', component: Foglalas },
    { path: 'aszf', component: Aszf },
    { path: 'adatvedelem', component: Adatvedelem },
    { path: 'termekek', component: Termekek },
    { path: 'admin-login', component: AdminLogin },
    { path: 'admin', component: Admin },
    { path: 'delete-rendeles', component: DeleteRendeles },
    { path: 'modify-delete-foglalas', component: ModifyDeleteFoglalas },
    { path: 'borbely-naptar', component: BorbelyNaptar }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
