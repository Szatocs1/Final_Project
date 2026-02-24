import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, Route } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { KosarService } from '../services/kosar.services';

interface Product {
  id: number;
  termekNev: string;
  kategoria: string;
  ar: number;
  kepNeve: string;
  megjegyzes?: string;
}

@Component({
  selector: 'app-termekek',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './termekek.html',
  styleUrl: './termekek.css'
})
export class Termekek implements OnInit {
  currentkategoria: string = 'Összes';
  selectedProduct: any = null;
  showProductModal: boolean = false;
  showSuccessToast: boolean = false;
  lastAddedProducttermekNev: string = '';
  selectedSize: string = 'M'; 
  showSizeChart: boolean = false;
  isLoading: boolean = false;
  allProducts : Product[] = [];


  filteredProducts : Product[] = [];

  constructor(private kosarService: KosarService, private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
  // 1. Üres állapot biztosítása
  this.allProducts = [];
  this.filteredProducts = [];

  this.isLoading = true;
  this.http.get('http://localhost:3000/api/termek/products')
  .subscribe({
    next: (response: any) => {
      this.isLoading = false;
      if (response && response.products) {
        this.allProducts = response.products;
        this.filteredProducts = [...this.allProducts];
        
        console.log('Adatok megérkeztek és a lista frissült!');
      }
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Hiba! Nem értek el az adatok:', err);
      this.cdr.detectChanges();
    }
  });
}

  filterBykategoria(kategoria: string) {
    this.currentkategoria = kategoria;
    this.filteredProducts = kategoria === 'Összes' 
      ? [...this.allProducts] 
      : this.allProducts.filter(p => p.kategoria === kategoria);
  } 

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.currentkategoria = 'Összes'; 
    this.filteredProducts = this.allProducts.filter(p => 
      p.termekNev.toLowerCase().includes(query) || 
      p.kategoria.toLowerCase().includes(query)
    );
  }

  openProductDetails(product: any) {
    this.selectedProduct = product;
    this.selectedSize = 'M';
    this.showProductModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeProductModal() {
    this.showProductModal = false;
    this.showSizeChart = false;
    document.body.style.overflow = 'auto';
  }

  getAvailableColors(producttermekNev: string) {
    const basetermekNev = producttermekNev.split(',')[0];
    return this.allProducts.filter(p => p.termekNev.startsWith(basetermekNev));
  }

  switchColor(variant: any) {
    this.selectedProduct = variant;
  }

  toggleSizeChart() {
    this.showSizeChart = !this.showSizeChart;
  }

  addToCart(product: any) {
    // Map backend fields to frontend cart fields
    const p = { 
      id: product.id,
      name: product.termekNev,        
      category: product.kategoria,   
      price: product.ar,             
      image: product.kepNeve,       
      size: product.kategoria === 'Ruházat' ? this.selectedSize : null 
    };
    
    this.kosarService.addToCart(p);
    
    this.lastAddedProducttermekNev = product.termekNev + (p.size ? ` (${p.size})` : '');

    this.showSuccessToast = false;

    setTimeout(() => {
      this.showSuccessToast = true;
    }, 10);

    setTimeout(() => {
      this.showSuccessToast = false;
      console.log('Toast eltüntetve');
    }, 3000);
  }
}
