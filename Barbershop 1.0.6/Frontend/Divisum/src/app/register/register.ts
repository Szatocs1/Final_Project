import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [CommonModule, RouterModule, FormsModule]
})
export class Register {
  constructor(private http: HttpClient){}

  username: string = '';
  email: string = '';
  phone_number: string = '';
  password: string = '';
  password_again: string = '';
  role: string ='';

  onSubmit(): void{
    const registrationData = {
      name: this.username,
      email: this.email,
      password: this.password,
      password_again: this.password_again,
      phone_number: this.phone_number,
      role: 'Fogyasztó'
    }
    this.http.post('http://localhost:3000/api/auth/register', registrationData).subscribe({
      next: (response) => {
        const token = (response as any).token;
        if(token){
          localStorage.setItem('token', token);
          window.location.href = '/logged-profil'
        }
        console.log("Sikeresen regisztráltál");
      },
      error: (error) => {
        console.error("Hiba a regisztrálás közben: ", error);
      }
    })
}}