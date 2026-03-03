import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KosarService {

  private items = signal<any[]>([]);

  cartCount = computed(() => {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  });

  get cartItems() {
    return this.items();
  }

  addToCart(product: any) {
    const currentItems = this.items();

    const existingItem = currentItems.find(i => 
      i.name === product.name && i.size === product.size
    );

    if (existingItem) {
      this.updateQuantity(product.name, 1, product.size);
    } else {
      this.items.set([
        ...currentItems, 
        { 
          ...product, 
          quantity: 1, 
          image: product.img || product.image 
        }
      ]);
    }
  }

  updateQuantity(productName: string, amount: number, size: string | null = null) {
    const currentItems = this.items().map(item => {
      if (item.name === productName && item.size === size) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    this.items.set(currentItems);
  }

  removeItem(product: any) {
    this.items.set(
      this.items().filter(i => 
        !(i.name === product.name && i.size === product.size)
      )
    );
  }

  clearCart() {
    this.items.set([]);
  }
}