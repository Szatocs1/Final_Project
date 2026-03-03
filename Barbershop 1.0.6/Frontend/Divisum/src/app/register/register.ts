import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [CommonModule, RouterModule, FormsModule]
})
export class Register {
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  username: string = '';
  email: string = '';
  phone_number: string = '';
  password: string = '';
  password_again: string = '';
  serverError: string = '';

  validatePhone(phone: string): boolean {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\s/g, '');
    const phoneRegex = /^(06\d{9})$|^(\+36\d{9})$/;
    return phoneRegex.test(cleanPhone);
  }

  onSubmit(): void {
    if (!this.validatePhone(this.phone_number)) {
      this.serverError = 'Érvénytelen telefonszám! Formátum: 06... (11 karakter) vagy +36... (13 karakter)';
      this.cdr.detectChanges();
      return;
    }

    if (this.password !== this.password_again) {
      this.serverError = 'A két jelszó nem egyezik meg!';
      this.cdr.detectChanges();
      return;
    }

    if (this.password.length < 6) {
      this.serverError = 'A jelszónak legalább 6 karakterből kell állnia!';
      this.cdr.detectChanges();
      return;
    }

    this.serverError = '';

    const registrationData = {
      name: this.username,
      email: this.email,
      password: this.password,
      password_again: this.password_again,
      phone_number: this.phone_number.replace(/\s/g, ''),
      role: 'Fogyasztó'
    };

    this.http.post('http://localhost:3000/api/auth/register', registrationData).subscribe({
      next: (response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          window.location.href = '/logged-profil';
        }
      },
      error: (error) => {
        console.error("Hiba a regisztrálás közben: ", error);
        if (error.status === 400 || error.status === 409) {
          this.serverError = 'Ez az email cím már használatban van!';
        } else {
          this.serverError = 'Hiba történt a regisztráció során.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}