import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { KosarService } from '../services/kosar.services';

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

constructor(public kosarService: KosarService) {}

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

// FIX: Changed item.id to item.name to match the service's updateQuantity function
changeQty(item: any, amount: number) {
  this.kosarService.updateQuantity(item.name, amount, item.size); 
}

proceedToCheckout() {
  console.log('Irány a pénztár a Sprinter-szállításhoz!');
}
}
