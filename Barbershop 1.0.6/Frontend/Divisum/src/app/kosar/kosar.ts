import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { KosarService } from '../services/kosar.services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-kosar',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    MatIconModule
  ],
  templateUrl: './kosar.html',
  styleUrl: './kosar.css'
})
export class Kosar {
  promoCode: string = '';
  isPromoApplied: boolean = false;
  discount: number = 0;

  vasarloNeve: string = '';
  vasarloEmail: string = '';
  telefonszam: string = '';
  iranyitoszam: string = '';
  telepules: string = '';
  szallitasiCim: string = '';

  isLoggedIn: boolean = false;

  constructor(public kosarService: KosarService, private http: HttpClient) {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

  get cartItems() {
    return this.kosarService.cartItems;
  }

  get subtotal() {
    return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  get total() {
    const discounted = this.subtotal * (1 - this.discount);
    return Math.round(discounted);
  }

  applyPromo() {
    if (this.promoCode.toUpperCase() === 'DIV26') {
      this.discount = 0.10;
      this.isPromoApplied = true;
    } else {
      alert('Érvénytelen promóciós kód!');
    }
  }

  removeItem(item: any) {
    this.kosarService.removeItem(item); 
  }

  changeQty(item: any, amount: number) {
    this.kosarService.updateQuantity(item.name, amount, item.size); 
  }

  proceedToCheckout() {
    console.log('Irány a pénztár a Sprinter-szállításhoz!');
  }

  isFormValid(): boolean {
    return !!(
      this.iranyitoszam.trim() &&
      this.telepules.trim() &&
      this.szallitasiCim.trim()
    );
  }

  onSendRendeles() {
    if (!this.isLoggedIn) {
      alert('A rendeléshez kérlek jelentkezz be!');
      return;
    }

    if (!this.isFormValid()) {
      alert('Kérlek töltsd ki az összes kötelező mezőt!');
      return;
    }

    const finalCart = this.kosarService.cartItems;
    const ar = this.total;

    const termekek = finalCart.map(item => ({
      id: Number(item.id),
      name: item.name,
      mennyiseg: item.quantity,
      ar: item.price
    }));

    const rendelesData: any = {
      termekek: termekek,
      ar: ar,
      iranyitoszam: this.iranyitoszam,
      telepules: this.telepules,
      szallitasiCim: this.szallitasiCim
    };

    const token = localStorage.getItem('token');
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    

    this.http.post('http://localhost:3000/api/rendelesek/rendelesCreate', rendelesData, { headers })
      .subscribe({
        next: (response: any) => {
          window.alert('Rendelés sikeresen elküldve!');
          console.log('Rendelés részletei:', response.rendeles);
          this.kosarService.clearCart();
          this.resetForm();
        },
        error: (error) => {
          console.error('Hiba a rendelés küldésekor:', error);
          window.alert('Hiba történt a rendelés elküldésekor!');
        }
      });
    }

  resetForm() {
    this.vasarloNeve = '';
    this.vasarloEmail = '';
    this.telefonszam = '';
    this.iranyitoszam = '';
    this.telepules = '';
    this.szallitasiCim = '';
    this.promoCode = '';
    this.isPromoApplied = false;
    this.discount = 0;
  }
}
