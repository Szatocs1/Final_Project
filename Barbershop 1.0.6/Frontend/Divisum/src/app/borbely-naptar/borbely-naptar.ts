import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-borbely-naptar',
  standalone: true,
  templateUrl: './borbely-naptar.html',
  styleUrl: './borbely-naptar.css',
  imports: [CommonModule, FormsModule, RouterModule, MatDatepickerModule, MatNativeDateModule]
})
export class BorbelyNaptar implements OnInit {
  barberName: string = '';
  foglalasok: any[] = []; 
  todayBookings: any[] = [];
  dailyBookings: any[] = [];
  selectedDate: Date = new Date();
  selectedBooking: any = null;
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.barberName = JSON.parse(userData).name || '';
    }
    if (!this.barberName) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadFoglalasok();
  }

  loadFoglalasok(): void {
    this.isLoading = true;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http.get<any>('http://localhost:3000/api/foglalas/getEveryFoglalas', { headers })
      .subscribe({
        next: (res) => {
          this.foglalasok = (res.foglalasok || []).filter((f: any) => f.borbely === this.barberName);
          this.filterTodayBookings();
          this.onDateSelected();
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  filterTodayBookings(): void {
    const ma = new Date();
    ma.setHours(0, 0, 0, 0);
    this.todayBookings = this.foglalasok.filter(f => {
      const fDate = new Date(f.idopont);
      fDate.setHours(0, 0, 0, 0);
      return fDate.getTime() === ma.getTime();
    });
  }

  onDateSelected() {
    this.selectedBooking = null;
    const selectedDateStr = this.selectedDate.toDateString();
    this.dailyBookings = this.foglalasok.filter(f => new Date(f.idopont).toDateString() === selectedDateStr);
    this.cdr.detectChanges();
  }

  showBookingDetails(b: any) { this.selectedBooking = b; }

  onLogout(): void {
    localStorage.clear();
    this.router.navigate(['/home']);
  }
  
  trackById(index: number, item: any): any { return item.id; }
}