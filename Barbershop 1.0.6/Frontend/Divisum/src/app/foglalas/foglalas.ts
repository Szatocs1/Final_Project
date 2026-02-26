import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-foglalas',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatCardModule, 
    MatDatepickerModule, MatNativeDateModule, 
    FormsModule, HttpClientModule
  ],
  templateUrl: './foglalas.html',
  styleUrl: './foglalas.css'
})
export class Foglalas implements OnInit {
  barbers: any[] = []; 
  existingBookings: any[] = [];

  selectedBarber: any = null; 
  selectedService: any = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;

  userData = { name: '', email: '', phone: '' };
  termsAccepted: boolean = false;
  showSuccessModal: boolean = false;

  services = [
    { name: 'Hajvágás', price: 6490, duration: 45, icon: 'content_cut' },
    { name: 'Szakáll igazítás', price: 4490, duration: 30, icon: 'face' },
    { name: 'Hajfestés', price: 24990, duration: 90, icon: 'colorize' },
    { name: 'Haj + Szakáll', price: 9990, duration: 75, icon: 'face_retouching_natural' },
    { name: 'Melirozás', price: 14990, duration: 120, icon: 'brush' },
    { name: 'Melír + Hajvágás', price: 19990, duration: 150, icon: 'content_cut' },
    { name: 'Melír + Haj + Szakáll', price: 29990, duration: 180, icon: 'face_retouching_natural' },
    { name: 'Apa + Gyerek kedvezmény', price: 8490, duration: 90, icon: 'groups' }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loadBarbers();
    this.loadExistingBookings();
  }

  loadBarbers() {
    this.http.get<any>('http://localhost:3000/api/auth/borbelyok').subscribe({
      next: (res) => {
        this.barbers = res.borbelyok || (Array.isArray(res) ? res : []);
        this.cdr.detectChanges();
        this.route.queryParams.subscribe(params => {
          const bName = params['barber'];
          if (bName) {
            const found = this.barbers.find(b => b.nev === bName);
            if (found) this.selectBarber(found);
          }
        });
      }
    });
  }

  loadExistingBookings() {
    this.http.get<any>('http://localhost:3000/api/foglalas/getEveryFoglalas').subscribe({
      next: (res) => { 
        if (Array.isArray(res)) {
          this.existingBookings = res;
        } else if (res && res.foglalasok) {
          this.existingBookings = res.foglalasok;
        } else if (res && res.data) {
          this.existingBookings = res.data;
        } else {
          this.existingBookings = [];
        }
        console.log("Foglalások betöltve:", this.existingBookings);
      },
      error: (err) => {
        console.warn("Hiba a foglaltság betöltésekor", err);
        this.existingBookings = [];
      }
    });
  }

  selectBarber(barber: any) {
    this.selectedBarber = barber;
    this.selectedService = null;
    this.selectedDate = null;
    this.selectedTime = null;
  }

  selectService(service: any) {
    this.selectedService = service;
    this.selectedDate = null;
    this.selectedTime = null;
  }

  onDateChange() {
    this.selectedTime = null;
    this.cdr.detectChanges();
  }

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d.getTime() >= today.getTime() && d.getDay() !== 0;
  }

  get availableTimes(): string[] {
    if (!this.selectedDate || !this.selectedService || !this.selectedBarber) return [];
    
    const times: string[] = [];
    const day = this.selectedDate.getDay();
    const startHour = 9;
    const endHour = (day === 6) ? 18 : 20;

    for (let h = startHour; h < endHour; h++) {
      for (let m of [0, 30]) {
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        times.push(timeStr);
      }
    }
    return times;
  }

  isSlotAvailable(time: string): boolean {
    if (!this.selectedDate || !this.selectedService || !Array.isArray(this.existingBookings)) return false;
    
    const [h, m] = time.split(':').map(Number);
    const checkSlot = new Date(this.selectedDate);
    checkSlot.setHours(h, m, 0, 0);

    if (checkSlot <= new Date()) return false;

    const dateKey = this.selectedDate.toLocaleDateString('en-CA');
    const serviceDuration = this.selectedService.duration; // percben

    const day = this.selectedDate.getDay();
    const closingHour = (day === 6) ? 18 : 20;
    const [selectedH, selectedM] = time.split(':').map(Number);
    const endMinutes = selectedH * 60 + selectedM + serviceDuration;
    if (endMinutes > closingHour * 60) return false;

    return !this.existingBookings.some((b: any) => {
      if (!b.idopont) return false;
      
      const bookingDate = b.idopont.split('T')[0]; 
      if (b.borbely !== this.selectedBarber.nev || bookingDate !== dateKey) return false;
      
      const existingBookingTime = new Date(b.idopont);
      const existingService = this.services.find(s => s.name === b.szolgaltatas);
      const existingDuration = existingService ? existingService.duration : 45; // alapértelmezett 45 perc
      const existingEnd = new Date(existingBookingTime.getTime() + existingDuration * 60000);
      
      const newStart = checkSlot;
      const newEnd = new Date(checkSlot.getTime() + serviceDuration * 60000);
      
      return newStart < existingEnd && newEnd > existingBookingTime;
    });
  }

  isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !!(
      this.selectedBarber &&
      this.userData.name.length > 2 &&
      emailRegex.test(this.userData.email) &&
      this.userData.phone.length > 5 &&
      this.termsAccepted &&
      this.selectedTime
    );
  }

  private getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) return null;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload.id || null;
    } catch (e) {
      console.error("Token dekódolási hiba:", e);
      return null;
    }
  }

  confirmBooking() {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (!token) {
      alert("Nincs token! Kérlek jelentkezz be.");
      return;
    }

    const userId = this.getUserIdFromToken();
    if (!userId) {
      alert("Nem sikerült a felhasználói azonosítót kiolvasni!");
      return;
    }

    if (this.isFormValid()) {
      const fullDate = new Date(this.selectedDate!);
      const [h, m] = this.selectedTime!.split(':').map(Number);
      fullDate.setHours(h, m, 0, 0);

      const bookingData = {
        nev: this.userData.name,
        email: this.userData.email,
        telefonszam: this.userData.phone,
        idopont: fullDate,
        borbely: this.selectedBarber.nev,
        userId: userId,
        borbelyId: this.selectedBarber.id,
        szolgaltatas: this.selectedService.name,
        ar: this.selectedService.price
      };

      const headers = {
        Authorization: `Bearer ${token}`
      };

      this.http.post('http://localhost:3000/api/foglalas/foglalasCreate', bookingData, { headers }).subscribe({
        next: () => {
          setTimeout(() => {
            this.showSuccessModal = true;
            this.cdr.detectChanges();
          }, 100);
          this.loadExistingBookings();
          window.scrollTo(0, 0);
        },
        error: (err) => alert("Hiba a mentés során!")
      });
    }
  }

  closeModal() {
    this.showSuccessModal = false;
    this.resetForm();
  }

  resetForm() {
    this.selectedBarber = null;
    this.selectedService = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.userData = { name: '', email: '', phone: '' };
    this.termsAccepted = false;
  }
}