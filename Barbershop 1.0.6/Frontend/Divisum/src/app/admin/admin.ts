import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  imports: [CommonModule, FormsModule]
})
export class Admin {
user: any = null;

  isLoading: boolean = false;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  name: string = '';

  onSearch() {
    this.userSearch();
  }

  userSearch() {
    const token = localStorage.getItem('token');
    const loginData = {
      name: this.name,
    }
    
    if (!token) {
      console.error("Nincs token, irány a login");
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:3000/api/auth/admin/getUserByName', loginData,{ headers})
      .subscribe({
        next: (response: any) => {
          this.user = response.user;
          this.isLoading = false;
          
          console.log('Felhasználói adatok megérkeztek:', this.user);
          
          this.cdr.detectChanges(); 
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Hiba az adatok lekérésekor:', error);
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

selectedFile: File | null = null;
product = {
    name: '',
    price: 0,
    category: 'Hajápolás',
    comment: ''
  };

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('Kiválasztott fájl:', this.selectedFile);
    }
  }

  onCreateProduct() {
  // 1. Ellenőrzés: Ne küldjünk üres adatokat
  if (!this.product.name || this.product.price <= 0 || !this.selectedFile) {
    alert("Kérlek, töltsd ki a nevet, az árat és válassz egy képet!");
    return;
  }

  const formData = new FormData();
  
  // 2. A megfelelő helyről szedjük az adatokat (this.product-ból)
  formData.append('name', this.product.name); 
  formData.append('price', this.product.price.toString());
  formData.append('category', this.product.category);
  formData.append('comment', this.product.comment);
  
  // 3. A fájl hozzáadása
  formData.append('file', this.selectedFile);
  console.log(this.selectedFile);

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post('http://localhost:3000/api/termek/admin/productsCreate', formData, { headers })
    .subscribe({
      next: (res) => {
        alert('Sikeres feltöltés!');
        // Opcionális: Űrlap alaphelyzetbe állítása siker után
        this.product = { name: '', price: 0, category: 'Hajápolás', comment: '' };
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Hiba:', err);
        alert('Hiba történt a feltöltés során!');
        console.log(this.selectedFile)
      }
    });
}
}