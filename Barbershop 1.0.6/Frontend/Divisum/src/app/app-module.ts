import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';     
import { MatCardModule } from '@angular/material/card';           
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './home/home';
import { Register } from './register/register';
import { Login } from './login/login';
import { Profil } from './profil/profil';
import { Kosar } from './kosar/kosar';
import { Foglalas } from './foglalas/foglalas';
import { Aszf } from './aszf/aszf';
import { Adatvedelem } from './adatvedelem/adatvedelem';
import { Termekek } from './termekek/termekek';

@NgModule({
  declarations: [
    
  ],
  imports: [
    App,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    Home,
    Register,
    Login,
    Profil,
    Kosar,
    Foglalas,
    MatButtonModule,
    MatIconModule,
    Aszf,
    Adatvedelem,
    Termekek,
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: []
})
export class AppModule { }
