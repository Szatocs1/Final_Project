import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { KosarService } from '../services/kosar.services';

@Component({
  selector: 'app-termekek',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './termekek.html',
  styleUrl: './termekek.css'
})
export class Termekek {
  currentCategory: string = 'Összes';
  selectedProduct: any = null;
  showProductModal: boolean = false;
  showSuccessToast: boolean = false;
  lastAddedProductName: string = '';
  selectedSize: string = 'M'; 
  showSizeChart: boolean = false;

  allProducts = [
    { id: 1, name: 'Signature Póló, Fekete', category: 'Ruházat', price: 12990, images: ['assets/images/Polo_Fekete_E.png'], description: 'Prémium pamut póló, kényelmes viselet a mindennapokra.', new: false },
    { id: 2, name: 'DIVISUM PréMIUM Sampon', category: 'Hajápolás', price: 9990, images: ['assets/images/Sampon.png'], description: 'Mélytisztító formula, amely felfrissíti a fejbőrt és fényessé teszi a hajat.', new: false },
    { id: 3, name: 'Professzionális Hajvágó Olló', category: 'Eszközök', price: 34990, images: ['assets/images/Ollo.png'], description: 'Japán acélból készült, precíziós olló professzionális borbélyoknak.', new: false },
    { id: 4, name: 'Professzionális Leválasztó Fésű', category: 'Eszközök', price: 7990, images: ['assets/images/Fesu.png'], description: 'Hőálló, antisztatikus fésű a tökéletes választékokért.', new: false },
    { id: 5, name: 'DIVISUM Prémium Kondicionáló', category: 'Hajápolás', price: 9990, images: ['assets/images/Kondicionalo.png'], description: 'Hidratáló kondicionáló, amely puhává és könnyen kezelhetővé teszi a hajat.', new: false },
    { id: 6, name: 'Signature Póló, Fehér', category: 'Ruházat', price: 12990, images: ['assets/images/Polo_Feher_E.png'], description: 'Klasszikus fehér póló, prémium anyaghasználattal.', new: false },
    { id: 7, name: 'Signature Póló, Szürke', category: 'Ruházat', price: 12990, images: ['assets/images/Polo_Szurke_E.png'], description: 'Modern szürke póló, amely minden stílushoz passzol.', new: false },
    { id: 8, name: 'DIVISUM Prémium Hajformázó Pomádé', category: 'Hajápolás', price: 9990, images: ['assets/images/Pomade.png'], description: 'Erős tartás és elegáns fény a klasszikus frizurákhoz.', new: false },
    { id: 9, name: 'DIVISUM Prémium Hajformázó Wax', category: 'Hajápolás', price: 9990, images: ['assets/images/Wax.png'], description: 'Természetes hatású tartás, matt finissel a modern stílus kedvelőinek.', new: false },
    { id: 11, name: 'Signature Kapucnis Pulóver, Fekete', category: 'Ruházat', price: 18900, images: ['assets/images/Pulover_Fekete_E.png'], description: 'Vastag, meleg kapucnis pulóver hímzett logóval.', new: false },
    { id: 12, name: 'Signature Kapucnis Pulóver, Fehér', category: 'Ruházat', price: 18900, images: ['assets/images/Pulover_Feher_E.png'], description: 'Letisztult fehér pulóver a DIVISUM kollekciójából.', new: false },
    { id: 13, name: 'Signature Kapucnis Pulóver, Szürke', category: 'Ruházat', price: 18900, images: ['assets/images/Pulover_Szurke_E.png'], description: 'Kényelmes viselet hűvösebb napokra.', new: false },
    { id: 14, name: 'Signature Póló, Kék', category: 'Ruházat', price: 12990, images: ['assets/images/Polo_Kek_E.png'], description: 'Az ikonikus sötétkék színű prémium pólónk.', new: false },
    { id: 15, name: 'Titánium Nyeles Borotva', category: 'Eszközök', price: 24990, images: ['assets/images/Nyeles_Borotva.png'], description: 'Cserélhető pengés borotva a legsimább eredményért.', new: false },
  ];

  filteredProducts = [...this.allProducts];

  constructor(private kosarService: KosarService) {}

  filterByCategory(category: string) {
    this.currentCategory = category;
    this.filteredProducts = category === 'Összes' 
      ? [...this.allProducts] 
      : this.allProducts.filter(p => p.category === category);
  } 

  onSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.currentCategory = 'Összes'; 
    this.filteredProducts = this.allProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
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

  getAvailableColors(productName: string) {
    const baseName = productName.split(',')[0];
    return this.allProducts.filter(p => p.name.startsWith(baseName));
  }

  switchColor(variant: any) {
    this.selectedProduct = variant;
  }

  toggleSizeChart() {
    this.showSizeChart = !this.showSizeChart;
  }

  addToCart(product: any) {
    const p = { 
      ...product, 
      img: product.images[0],
      size: product.category === 'Ruházat' ? this.selectedSize : null 
    };
    
    this.kosarService.addToCart(p);
    
    this.lastAddedProductName = product.name + (p.size ? ` (${p.size})` : '');

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