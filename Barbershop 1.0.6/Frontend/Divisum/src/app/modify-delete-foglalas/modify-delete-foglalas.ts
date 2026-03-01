import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-modify-delete-foglalas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatCardModule, 
    MatDatepickerModule, MatNativeDateModule, HttpClientModule
  ],
  templateUrl: './modify-delete-foglalas.html',
  styleUrl: './modify-delete-foglalas.css'
})
export class ModifyDeleteFoglalas implements OnInit {
  searchId: string = '';
  editableFoglalas: any = null;
  foglalasId: any = null;
  existingBookings: any[] = [];
  barbers: any[] = [];

  customerName: string = '';
  customerEmail: string = '';
  customerPhone: string = '';

  selectedBarber: any = null;
  selectedService: any = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;

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

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBarbers();
    this.loadExistingBookings();
  }

  loadBarbers() {
    this.http.get<any>('http://localhost:3000/api/auth/borbelyok').subscribe(res => {
      this.barbers = res.borbelyok || res;
    });
  }

  loadExistingBookings() {
    this.http.get<any>('http://localhost:3000/api/foglalas/getEveryFoglalas').subscribe(res => {
      this.existingBookings = Array.isArray(res) ? res : (res.foglalasok || []);
    });
  }

  loadFoglalasById() {
    this.http.post<any>('http://localhost:3000/api/foglalas/getFoglalasById', { id: this.searchId }).subscribe({
      next: (res) => {
        if (res && res.foglalas) {
          const f = res.foglalas;
          this.editableFoglalas = f;
          this.foglalasId = Number(f.id);
          
          this.customerName = f.nev;
          this.customerEmail = f.email;
          this.customerPhone = f.telefonszam;

          this.selectedBarber = this.barbers.find(b => b.nev === f.borbely);
          this.selectedService = this.services.find(s => s.name === f.szolgaltatas);
          this.selectedDate = new Date(f.idopont);
          this.selectedTime = new Date(f.idopont).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }).substring(0, 5);
          
          this.cdr.detectChanges();
        }
      },
      error: () => alert("Foglalás nem található!")
    });
  }

  deleteFoglalas(): void {
    if (!this.foglalasId) return;
    if (confirm("Biztosan törölni szeretnéd ezt a foglalást?")) {
      this.http.delete('http://localhost:3000/api/foglalas/foglalasDelete', { 
        body: { id: this.foglalasId } 
      }).subscribe({
        next: () => {
          alert("Sikeres törlés!");
          this.resetForm();
          this.loadExistingBookings();
        },
        error: (err) => console.error("Törlési hiba:", err)
      });
    }
  }

  updateFoglalas() {
    if (!this.selectedDate || !this.selectedTime) return;

    const date = new Date(this.selectedDate);
    const [h, m] = this.selectedTime.split(':').map(Number);
    date.setHours(h, m, 0, 0);

    const updates = {
      id: this.foglalasId,
      idopont: date || null,
      borbely: this.selectedBarber.nev || null,
      szolgaltatas: this.selectedService.name || null,
      ar: this.selectedService.price || null,
      nev: this.customerName || null,
      email: this.customerEmail || null,
      telefonszam: this.customerPhone || null
    };

    this.http.put(`http://localhost:3000/api/foglalas/foglalasModify/`, updates).subscribe({
      next: () => { 
        alert("Sikeres frissítés!");
        window.location.href = '/home';
      },
      error: () => alert("Hiba történt a módosítás során!")
    });
  }

  resetForm() {
    this.editableFoglalas = null;
    this.searchId = '';
    this.selectedBarber = null;
    this.selectedService = null;
    this.selectedDate = null;
    this.selectedTime = null;
  }

  isSlotAvailable(time: string): boolean {
    if (!this.selectedDate || !this.selectedService || !this.selectedBarber) return false;
    const [h, m] = time.split(':').map(Number);
    const checkStart = new Date(this.selectedDate);
    checkStart.setHours(h, m, 0, 0);
    if (checkStart <= new Date()) return false;

    const checkEnd = new Date(checkStart.getTime() + this.selectedService.duration * 60000);
    return !this.existingBookings.some(b => {
      if (b.id === this.foglalasId) return false;
      if (b.borbely !== this.selectedBarber.nev) return false;
      const bStart = new Date(b.idopont);
      if (bStart.toDateString() !== this.selectedDate!.toDateString()) return false;
      const bEnd = new Date(bStart.getTime() + 45 * 60000); // Alapértelmezett 45p
      return (checkStart < bEnd && checkEnd > bStart);
    });
  }

  get availableTimes(): string[] {
    if (!this.selectedDate) return [];
    const times = [];
    const end = this.selectedDate.getDay() === 6 ? 18 : 20;
    for (let h = 9; h < end; h++) {
      for (let m of ['00', '30']) times.push(`${h.toString().padStart(2, '0')}:${m}`);
    }
    return times;
  }

  selectBarber(b: any) { this.selectedBarber = b; this.selectedTime = null; }
  selectService(s: any) { this.selectedService = s; this.selectedTime = null; }
  onDateChange() { this.selectedTime = null; }
}