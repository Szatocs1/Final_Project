import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}