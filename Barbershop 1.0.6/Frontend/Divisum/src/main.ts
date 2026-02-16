import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app/app-routing-module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(
      AppRoutingModule, 
      MatButtonModule, 
      MatIconModule
    ),
    provideAnimations()
  ]
}).catch(err => console.error(err));