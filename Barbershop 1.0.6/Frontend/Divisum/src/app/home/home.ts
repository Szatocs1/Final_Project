import { ChangeDetectionStrategy, Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { KosarService } from '../services/kosar.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatExpansionModule, 
    MatChipsModule, 
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  readonly panelOpenState = signal(false);
  
  isMenuOpen = false;

  showModal = false;
  selectedProduct: any = null;

  selectedSize: string = 'M';
  showSizeChart: boolean = false;
  
  products = [
    { 
      id: 1,
      name: 'Signature Pamut Póló', 
      category: 'Ruházat', 
      img: 'assets/images/Polo_Fekete_E.png', 
      price: 12990,
      description: '100% prémium fésült pamutból készült, tartós és kényelmes viselet a mindennapokra. Elegáns Divisum hímzéssel és modern szabással.',
      reviews: [
        { user: 'Kovács Bálint', comment: 'Nagyon jó az anyaga, mosás után sem ment össze.', rating: 5 },
        { user: 'Nagy László', comment: 'Kényelmes, prémium érzet.', rating: 4 }
      ]
    },
    { 
      id: 2,
      name: 'Prémium Japán Pengés Olló', 
      category: 'Eszközök', 
      img: 'assets/images/Ollo.png', 
      price: 34990,
      description: 'Kézzel kovácsolt japán acélból készült professzionális hajvágó olló. Élettartam garanciával és precíziós vágóéllel a tökéletes finiseléshez.',
      reviews: [
        { user: 'Barber Pisti', comment: 'A legjobb olló, amivel valaha dolgoztam!', rating: 5 }
      ]
    },
    { 
      id: 3,
      name: 'DIVISUM Volumizing Sampon', 
      category: 'Hajápolás', 
      img: 'assets/images/Sampon.png', 
      price: 9990,
      description: 'Természetes összetevőket tartalmazó volumenizáló sampon, amely tartást és fényt ad a hajnak anélkül, hogy elnehezítené.',
      reviews: [
        { user: 'Tóth Adrienn', comment: 'Kellemes illat és tényleg dúsabb tőle a hajam.', rating: 5 }
      ]
    }
  ];

  constructor(public kosarService: KosarService) {}

  addToCart(product: any) {
    if (product) {
      const productToAdd = { 
        ...product, 
        size: product.category === 'Ruházat' ? this.selectedSize : null 
      };
      
      this.kosarService.addToCart(productToAdd);
    }
  }

  openDetails(product: any) {
    this.selectedProduct = product;
    this.selectedSize = 'M'; 
    this.showModal = true;
    this.showSizeChart = false;
    document.body.style.overflow = 'hidden'; 
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
    this.showSizeChart = false;
    document.body.style.overflow = 'auto'; 
  }

  toggleSizeChart() {
    this.showSizeChart = !this.showSizeChart;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {

      alert('A kedvezménykód másolva a vágólapra: ' + text); 
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}