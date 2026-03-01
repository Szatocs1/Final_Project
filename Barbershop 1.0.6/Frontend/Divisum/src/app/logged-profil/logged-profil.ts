
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
  isEditModalOpen = false;

  editData: any = {};
  passwordData = { currentPassword: '', newPassword: '', newPasswordAgain: '' };
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.fetchUserData(); }

  fetchUserData() {
    const token = localStorage.getItem('token');
    if (!token) { this.router.navigate(['/login']); return; }

    this.isLoading = true;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get('http://localhost:3000/api/auth/profile', { headers }).subscribe({
      next: (res: any) => {
        this.user = res.user || res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.onLogout(); }
    });
  }

  openEditModal() {
    this.editData = { ...this.user };
    this.passwordData = { currentPassword: '', newPassword: '', newPasswordAgain: '' };
    this.imagePreview = null;
    this.selectedFile = null;
    this.isEditModalOpen = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result; this.cdr.detectChanges(); };
      reader.readAsDataURL(file);
    }
  }

  onUpdateProfile() {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    formData.append('nev', this.editData.nev);
    formData.append('telefonszam', this.editData.telefonszam);
    if (this.selectedFile) formData.append('profileImage', this.selectedFile);
    if (this.passwordData.newPassword) {
      formData.append('currentPassword', this.passwordData.currentPassword);
      formData.append('newPassword', this.passwordData.newPassword);
      formData.append('newPasswordAgain', this.passwordData.newPasswordAgain)
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.put('http://localhost:3000/api/auth/modifyUser', formData, { headers }).subscribe({
      next: () => {
        this.fetchUserData();
        this.isEditModalOpen = false;
        alert('Sikeres frissítés!');
      },
      error: (err) => { alert(err.error.message || 'Hiba történt!'); this.isLoading = false; }
    });
  }

  onLogout(): void {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    if (token) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      this.http.post('http://localhost:3000/api/auth/logout', {}, { headers }).subscribe();
    }
    this.router.navigate(['/home']);
  }
}

