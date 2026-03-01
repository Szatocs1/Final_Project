import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-borbely-naptar',
  standalone: true,
  templateUrl: './borbely-naptar.html',
  styleUrl: './borbely-naptar.css',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class BorbelyNaptar implements OnInit {
  barberName: string = '';
  foglalasok: any[] = [];
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.barberName = user.name || '';
    }
    
    if (!this.barberName) {
      alert("Nincs bejelentkezve vagy nem borbély!");
      this.router.navigate(['/home']);
      return;
    }

    this.loadFoglalasok();
  }

  loadFoglalasok(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('http://localhost:3000/api/foglalas/getEveryFoglalas', { headers })
      .subscribe({
        next: (res) => {
          this.foglalasok = (res.foglalasok || []).filter((f: any) => 
            f.borbely === this.barberName
          );
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Hiba a foglalások betöltésekor:", err);
          this.isLoading = false;
        }
      });
  }

  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

  // Mark foglalas as completed
  markCompleted(foglalasId: number): void {
    if (!confirm("Biztosan bejelöli elkészültként?")) return;
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put<any>(`http://localhost:3000/api/foglalas/admin/modifyFoglalas`, 
      { id: foglalasId, allapot: 'elkészült' }, 
      { headers }
    ).subscribe({
      next: () => {
        alert("Foglalás megjelölve elkészültként!");
        this.loadFoglalasok();
      },
      error: (err) => alert("Hiba történt!")
    });
  }
}
