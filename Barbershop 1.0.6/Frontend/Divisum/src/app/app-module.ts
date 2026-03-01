import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 
import { provideHttpClient } from '@angular/common/http';

// Material modulok
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';     
import { MatCardModule } from '@angular/material/card';           

// Saját komponensek és modulok
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
import { LoggedProfil } from './logged-profil/logged-profil';
import { Admin } from './admin/admin';
import { AdminLogin } from './admin-login/admin-login';
import { ModifyDeleteFoglalas } from './modify-delete-foglalas/modify-delete-foglalas';
import { DeleteRendeles } from './delete-rendeles/delete-rendeles';

@NgModule({
  declarations: [
    // Standalone komponensek ide nem kellenek
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule, // Fontos a regisztrációs formhoz
    
    // Standalone komponensek
    App,
    Home,
    Register,
    Login,
    Profil,
    Kosar,
    Foglalas,
    Aszf,
    Adatvedelem,
    Termekek,
    LoggedProfil,
    Admin,
    AdminLogin,
    DeleteRendeles,
    ModifyDeleteFoglalas,


    // Material modulok
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
  ],
  providers: [
    provideHttpClient() // Ezzel váltjuk ki a HttpClientModule-t
  ],
  bootstrap: []
})
export class AppModule { }