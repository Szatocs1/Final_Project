import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
  imports: [CommonModule, RouterModule, FormsModule]
})
export class AdminLogin {
constructor(private http: HttpClient, private router: Router){}

  email: string = '';
  password: string = '';

  onSubmit(): void{
    const loginData = {
      email: this.email,
      password: this.password,
    }
    this.http.post('http://localhost:3000/api/auth/admin/login', loginData).subscribe({
      next: (response) =>{
        const token = (response as any).token;
        const role = (response as any).role
        if(role){
          localStorage.setItem('role', role);
        }
        if(token){
          localStorage.setItem('token', token);
          this.router.navigate(['/admin']);
        }
        console.log("Sikeres Admin bejelentkezés!")
      },
      error: (error) =>{
        console.error("Hiba a bejelntkezés közben: ", error);
      }
    })
  }
}