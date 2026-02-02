import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // 1. Importáld a RouterModule-t

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [RouterModule], // 2. Add hozzá az imports tömböt a RouterModule-lel
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