import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [CommonModule, RouterModule, FormsModule]
})
export class Login {
  email: string = '';
  password: string = '';
  loginError: string = ''; 

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {

    this.loginError = '';

    if (!this.email || !this.password) {
      this.loginError = 'Kérjük, töltse ki mindkét mezőt!';
      return;
    }

    if (this.password.length < 6) {
      this.loginError = 'A jelszónak legalább 6 karakterből kell állnia!';
      return;
    }

    this.http.post('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          window.location.href = '/home';
        }
      },
      error: (error) => {
        if (error.status === 401 || error.status === 404) {
          this.loginError = 'Hibás email cím vagy jelszó!';
        } else {
          this.loginError = 'Hálózati hiba történt, próbálja újra később!';
        }

        this.cdr.detectChanges();
      }
    });
  }
}