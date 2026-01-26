import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-foglalas',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, FormsModule],
  templateUrl: './foglalas.html',
  styleUrl: './foglalas.css'
})
export class Foglalas {
  selectedBarber: string | null = null;
  selectedService: any = null;
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  termsAccepted: boolean = false;
  showSuccessModal: boolean = false;

  userData = { name: '', email: '', phone: '' };

  existingBookings = [
    { barber: 'Áron', date: '2026-01-26', start: '10:00', end: '11:00' },
    { barber: 'Máté', date: '2026-01-26', start: '14:00', end: '15:00' }
  ];

  services = [
    { name: 'Hajvágás', price: 6500, duration: 45, icon: 'content_cut' },
    { name: 'Szakáll igazítás', price: 4500, duration: 30, icon: 'face' },
    { name: 'Hajfestés', price: 8500, duration: 90, icon: 'colorize' },
    { name: 'Haj + Szakáll', price: 9500, duration: 75, icon: 'face_retouching_natural' },
    { name: 'Melirozás', price: 10500, duration: 120, icon: 'brush' },
    { name: 'Apa + Gyerek kedvezmény', price: 10000, duration: 90, icon: 'groups' }
  ];

  selectBarber(name: string) {
    this.selectedBarber = name;
    this.selectedTime = null;
  }

  selectService(service: any) {
    this.selectedService = service;
    this.selectedTime = null;
  }

  onDateChange() {
    this.selectedTime = null;
  }

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? (d >= today && d.getDay() !== 0) : false;
  };

  get availableTimes(): string[] {
    if (!this.selectedDate || !this.selectedService || !this.selectedBarber) return [];

    const times: string[] = [];
    const day = this.selectedDate.getDay();
    const startHour = 9;
    const endHour = (day === 6) ? 18 : 22; 
    const duration = this.selectedService.duration;

    for (let h = startHour; h < endHour; h++) {
      for (let m of [0, 30]) {
        const startTimeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        
        if (this.isSlotAvailable(startTimeStr, duration)) {
          times.push(startTimeStr);
        }
      }
    }
    return times;
  }

  isSlotAvailable(startTimeStr: string, durationMin: number): boolean {
    const [h, m] = startTimeStr.split(':').map(Number);
    const slotStart = new Date(this.selectedDate!);
    slotStart.setHours(h, m, 0, 0);

    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotStart.getMinutes() + durationMin);

    if (slotStart <= new Date()) return false;

    const closingHour = (this.selectedDate!.getDay() === 6) ? 18 : 22;
    if (slotEnd.getHours() > closingHour || (slotEnd.getHours() === closingHour && slotEnd.getMinutes() > 0)) return false;

    const dateKey = this.selectedDate!.toISOString().split('T')[0];
    const conflicts = this.existingBookings.filter(b => b.barber === this.selectedBarber && b.date === dateKey);

    for (let booking of conflicts) {
      const bStart = this.timeToDate(booking.start);
      const bEnd = this.timeToDate(booking.end);
      
      if (slotStart < bEnd && slotEnd > bStart) return false;
    }

    return true;
  }

  private timeToDate(timeStr: string): Date {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(this.selectedDate!);
    d.setHours(h, m, 0, 0);
    return d;
  }

  isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !!(
      this.userData.name.length > 2 &&
      emailRegex.test(this.userData.email) &&
      this.userData.phone.length > 5 &&
      this.termsAccepted &&
      this.selectedTime
    );
  }

  confirmBooking() {
    if (this.isFormValid()) {
      this.existingBookings.push({
        barber: this.selectedBarber!,
        date: this.selectedDate!.toISOString().split('T')[0],
        start: this.selectedTime!,
        end: this.dateToTimeString(this.selectedTime!, this.selectedService.duration)
      });
      this.showSuccessModal = true;
    }
  }

  private dateToTimeString(start: string, addMin: number): string {
    const [h, m] = start.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m + addMin);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
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