import { ChangeDetectionStrategy, Component, signal, CUSTOM_ELEMENTS_SCHEMA, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { KosarService } from '../services/kosar.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatExpansionModule, 
    MatChipsModule, 
    RouterModule,
    HttpClientModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home implements OnInit {
  readonly panelOpenState = signal(false);
  
  isMenuOpen = false;

  barbers: any[] = [];

  showModal = false;
  selectedProduct: any = null;

  showQuickSizeSelect = false;
  tempProduct: any = null;

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

  constructor(public kosarService: KosarService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBarbers();
  }

  loadBarbers() {
    this.http.get<any>('http://localhost:3000/api/auth/borbelyok').subscribe({
      next: (res) => {
        this.barbers = res.borbelyok || (Array.isArray(res) ? res : []);
        console.log('Borbélyok betöltve (home):', this.barbers);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Hiba a borbélyok betöltésekor:', err);
      }
    });
  }

  addToCart(product: any) {
    if (!product) return;

    if (product.category === 'Ruházat' && !this.showModal && !this.showQuickSizeSelect) {
      this.tempProduct = product;
      this.showQuickSizeSelect = true;
      document.body.style.overflow = 'hidden';
      return;
    }

    const productToAdd = { 
      ...product, 
      size: product.category === 'Ruházat' ? this.selectedSize : null 
    };
    
    this.kosarService.addToCart(productToAdd);

    this.closeQuickSelect();
    console.log('Termék hozzáadva:', productToAdd);
  }

  confirmQuickSize(size: string) {
    this.selectedSize = size;
    if (this.tempProduct) {
      this.addToCart(this.tempProduct);
    }
  }

  closeQuickSelect() {
    this.showQuickSizeSelect = false;
    this.tempProduct = null;
    this.selectedSize = 'M';
    if (!this.showModal) document.body.style.overflow = 'auto';
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
    if (!this.showQuickSizeSelect) document.body.style.overflow = 'auto'; 
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