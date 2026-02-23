import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logged-profil',
  standalone: true,
  templateUrl: './logged-profil.html',
  styleUrl: './logged-profil.css',
  imports: [FormsModule, CommonModule, RouterModule],
})
export class LoggedProfil implements OnInit {
  user: any = null;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchUserData();
  }

  fetchUserData() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("Nincs token, irány a login");
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get('http://localhost:3000/api/auth/profile', { headers })
      .subscribe({
        next: (response: any) => {
          this.user = response.user || response;
          this.isLoading = false;
          
          console.log('Profil adatok megérkeztek:', this.user);
          
          this.cdr.detectChanges(); 
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Hiba az adatok lekérésekor:', error);
          if (error.status === 401 || error.status === 403) {
            this.onLogout();
          }
        },
      });
  }

  onLogout(): void {
    const currentToken = localStorage.getItem('token');
    
    const clearSession = () => {
      localStorage.removeItem('token');
      this.router.navigate(['/home']);
    };

    if (!currentToken) {
      clearSession();
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${currentToken}` });

    this.http.post('http://localhost:3000/api/auth/logout', {}, { headers }).subscribe({
      next: () => {
        console.log("Sikeres kijelentkezés!");
        clearSession();
      },
      error: (error) => {
        console.error("Hiba kijelentkezéskor:", error);
        clearSession();
      }
    });
  }
}