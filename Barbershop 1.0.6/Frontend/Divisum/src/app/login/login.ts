import { Component } from '@angular/core';
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
  constructor(private http: HttpClient){}

  email: string = '';
  password: string = '';

  onSubmit(): void{
    const loginData = {
      email: this.email,
      password: this.password,
    }
    this.http.post('http://localhost:3000/api/auth/login', loginData).subscribe({
      next: (response) =>{
        const token = (response as any).token;
        if(token){
          localStorage.setItem('token', token);
          window.location.href = '/home'
        }
        console.log("Sikeres bejelentkezés!")
      },
      error: (error) =>{
        console.error("Hiba a bejelntkezés közben: ", error);
      }
    })
}}