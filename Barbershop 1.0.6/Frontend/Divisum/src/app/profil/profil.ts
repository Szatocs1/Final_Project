import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  constructor(private http: HttpClient) {}
    ngOnInit(){   
      const token = localStorage.getItem('token');

      if(token){
        window.location.href = '/logged-profil'
      }
    }

  goToLogin() {
    window.location.href = '/login'
  }

  goToRegister() {
    window.location.href = '/register'
  }
}