import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  imports: [CommonModule, FormsModule]
})
export class Admin {
user: any = null;

  isLoading: boolean = false;
  editingProductId: number | null = null;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  name: string = '';
  isEditing: boolean = false;

  onSearch() {
    this.userSearch();
  }

  userSearch() {
    const token = localStorage.getItem('token');
    const loginData = {
      name: this.name,
    }
    
    if (!token) {
      console.error("Nincs token, irány a login");
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:3000/api/auth/admin/getUserByName', loginData,{ headers})
      .subscribe({
        next: (responseponse: any) => {
          this.user = responseponse.user;
          this.isLoading = false;
          
          console.log('Felhasználói adatok megérkeztek:', this.user);
          
          this.cdr.detectChanges(); 
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Hiba az adatok lekérésekor:', error);
        },
      });
  }

  onLogout(): void {
    const currentToken = localStorage.getItem('token');
    
const clearSession = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/home']);
    };

    if (!currentToken) {
      clearSession();
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${currentToken}` });

    this.http.post('http://localhost:3000/api/auth/logout', {}, { headers }).subscribe({
      next: () => {
        console.log("Sikeresponse kijelentkezés!");
        clearSession();
      },
      error: (error) => {
        console.error("Hiba kijelentkezéskor:", error);
        clearSession();
      }
    });
  }

selectedFile: File | null = null;
product = {
    name: '',
    price: 0,
    category: 'Hajápolás',
    comment: ''
  };

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log('Kiválasztott fájl:', this.selectedFile);
    }
  }

  onCreateProduct() {
  if (!this.product.name || this.product.price <= 0 || !this.selectedFile) {
    alert("Kérlek, töltsd ki a nevet, az árat és válassz egy képet!");
    return;
  }

  const formData = new FormData();
  
  formData.append('name', this.product.name); 
  formData.append('price', this.product.price.toString());
  formData.append('category', this.product.category);
  formData.append('comment', this.product.comment);
  
  formData.append('file', this.selectedFile);
  console.log(this.selectedFile);

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post('http://localhost:3000/api/termek/admin/productsCreate', formData, { headers })
    .subscribe({
      next: (response) => {
        alert('Sikeresponse feltöltés!');
        this.product = { name: '', price: 0, category: 'Hajápolás', comment: '' };
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Hiba:', err);
        alert('Hiba történt a feltöltés során!');
        console.log(this.selectedFile)
      }
    });
}

  username: string = '';
  email: string = '';
  phone_number: string = '';
  password: string = '';
  password_again: string = '';
  role: string ='';

  onCreateUser(): void{
    const registrationData = {
      name: this.username,
      email: this.email,
      password: this.password,
      password_again: this.password_again,
      phone_number: this.phone_number,
      role: 'Fogyasztó'
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:3000/api/auth/admin/createUser', registrationData, { headers }).subscribe({
      next: (responseponse) => {
        const token = (responseponse as any).token;
        if(token){
          localStorage.setItem('token', token);
          window.location.href = '/logged-profil'
        }
        alert("Sikeresponseen regisztráltál");
      },
      error: (error) => {
        console.error("Hiba a regisztrálás közben: ", error);
      }
    })
}

  emailFind: string = '';
  foundByEmail: any = null;

  onGetByEmail(): void{
    const email = {
      email: this.emailFind,
    }

    if (!this.emailFind) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.post<any>('http://localhost:3000/api/auth/admin/getUserByEmail', email, { headers })
    .subscribe({
      next: (response) => {
        this.foundByEmail = response.user;
      },
      error: (err) => {
        alert("Hiba történt a felhasználó email általi lekérésekor!");
        this.foundByEmail = null;
      }
    });
  }

searchProductByName: string = '';
foundProduct: any = null;
foundProductId: any = null;

getProductByName() {
  if (!this.searchProductByName) return;

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post<any>('http://localhost:3000/api/termek/admin/getProductByName', { name: this.searchProductByName }, { headers }
  ).subscribe({
    next: (response) => {
      this.foundProduct = response.productWithFullImageUrl;
      if (this.foundProduct) {
        this.foundProduct.termekNev = this.foundProduct.termekNev || this.foundProduct.nev;
        this.foundProduct.kategoria = this.foundProduct.kategoria || this.foundProduct.category;
        this.foundProduct.megjegyzes = this.foundProduct.megjegyzes || this.foundProduct.leiras || this.foundProduct.comment;
        this.foundProduct.ar = this.foundProduct.ar || this.foundProduct.price;
      }
      this.foundProductId = response.productWithFullImageUrl.id;
      console.log("Termék adatai:", this.foundProduct);
    },
    error: (err) => {
      console.error("Hiba:", err);
      alert("A termék nem található!");
      this.foundProduct = null;
    }
  });
}

selectedCategory: string = '';
categoryProducts: any[] = [];
searched: boolean = false;

getProductsByCategory() {
    if (!this.selectedCategory) {
      alert("Kérlek válassz ki egy kategóriát!");
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<any>('http://localhost:3000/api/termek/admin/getProductsByCategory', 
      { category: this.selectedCategory }, 
      { headers }
    ).subscribe({
      next: (res) => {
        this.categoryProducts = res.products || [];
        this.searched = true;
        console.log("Sikeres lekérés:", this.categoryProducts);
      },
      error: (err) => {
        console.error("Hiba a kategória lekérésekor:", err);
        this.categoryProducts = [];
        this.searched = true;
        alert(err.error?.message || "Hiba történt a lekérés során.");
      }
    });
  }

  searchName: string = '';
  foundOrders: any[] = [];
  Searched: boolean = false;

searchOrder() {
  if (!this.searchName) return;

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post<any>('http://localhost:3000/api/rendeles/admin/getRendelesByName', 
    { name: this.searchName }, 
    { headers }
  ).subscribe({
    next: (res) => {
      this.foundOrders = (res.rendeles || []).map((r: any) => ({
        ...r,
        parsedTermekek: typeof r.termekek === 'string' ? JSON.parse(r.termekek) : r.termekek
      }));
      this.searched = true;
    },
    error: (err) => {
      console.error("Hiba a keresésben:", err);
      this.foundOrders = [];
      this.searched = true;
    }
  });
}

searchEmail: string = '';
foundOrdersByEmail: any[] = [];
searchedEmail: boolean = false;

searchByEmail() {
  if (!this.searchEmail) return;

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post<any>('http://localhost:3000/api/rendeles/admin/getRendelesByEmail', 
    { email: this.searchEmail }, 
    { headers }
  ).subscribe({
    next: (res) => {
      this.foundOrdersByEmail = (res.rendeles || []).map((r: any) => ({
        ...r,
        parsedTermekek: typeof r.termekek === 'string' ? JSON.parse(r.termekek) : r.termekek
      }));
      this.searchedEmail = true;
    },
    error: (err) => {
      console.error("Hiba a keresésben:", err);
      this.foundOrdersByEmail = [];
      this.searchedEmail = true;
    }
  });
}

searchNameFoglalas: string = '';
foundFoglalasok: any[] = [];
searchedFoglalas: boolean = false;

searchFoglalas() {
  if (!this.searchNameFoglalas) return;

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post<any>('http://localhost:3000/api/foglalas/admin/getFoglalasByName', 
    { name: this.searchNameFoglalas }, 
    { headers }
  ).subscribe({
    next: (res) => {
      this.foundFoglalasok = res.foglalas || [];
      this.searchedFoglalas = true;
    },
    error: (err) => {
      console.error("Hiba a foglalás keresésben:", err);
      this.foundFoglalasok = [];
      this.searchedFoglalas = true;
    }
  });
}

searchEmailFoglalas: string = '';
foundFoglalasokByEmail: any[] = [];
searchedEmailFoglalas: boolean = false;

searchFoglalasByEmail() {
  if (!this.searchEmailFoglalas) return;

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post<any>('http://localhost:3000/api/foglalas/admin/getFoglalasByEmail', 
    { email: this.searchEmailFoglalas }, 
    { headers }
  ).subscribe({
    next: (res) => {
      this.foundFoglalasokByEmail = res.foglalas || [];
      this.searchedEmailFoglalas = true;
    },
    error: (err) => {
      console.error("Hiba a foglalás keresésben:", err);
      this.foundFoglalasokByEmail = [];
      this.searchedEmailFoglalas = true;
    }
  });
}

  onEditUser(userData: any) {
  this.isEditing = !this.isEditing;
}

saveUserChanges(userData: any) {
  if (!userData || !userData.id) return;

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  const payload = {
    id: userData.id,
    name: userData.nev,
    email: userData.email,
    phone: userData.telefonszam,
    role: userData.foglaltsag,
    password: userData.password || '' 
  };

  this.http.put('http://localhost:3000/api/auth/admin/modifyUser', payload, { headers }).subscribe({
    next: (res: any) => {
      alert("Felhasználó sikeresen módosítva!");
      this.isEditing = false;
    },
    error: (err) => alert("Hiba a módosításkor!")
  });
}

onDeleteUser(userId: number) {
  if (!confirm("Biztosan törli?")) return;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.delete('http://localhost:3000/api/auth/admin/deleteUser', { headers, body: { id: userId } }).subscribe({
    next: () => { 
      alert("Törölve!"); 
      this.user = null; 
      this.foundByEmail = null; 
      this.isEditing = false;
    }
  });
}
// Változók
  isProductEditing: boolean = false;

  onEditProduct(prod: any) {
    this.isProductEditing = !this.isProductEditing;
  }

saveProductChanges(product: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const productId = product.id;
    const productName = (product.termekNev && product.termekNev.trim() !== "") 
      ? product.termekNev 
      : (this.foundProduct?.termekNev || "");
    
    const productCategory = (product.kategoria && product.kategoria.trim() !== "") 
      ? product.kategoria 
      : (this.foundProduct?.kategoria || "");
    const productPrice = (product.ar !== undefined && product.ar !== "" && !isNaN(product.ar))
      ? product.ar 
      : (this.foundProduct?.ar || 0);
    
    const productComment = (product.megjegyzes && product.megjegyzes.trim() !== "") 
      ? product.megjegyzes 
      : (this.foundProduct?.megjegyzes || "");
    
    const formData = new FormData();
    formData.append('id', productId.toString());
    formData.append('name', productName);
    formData.append('category', productCategory);
    formData.append('price', productPrice.toString());
    formData.append('comment', productComment);
    


    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http.put<any>('http://localhost:3000/api/termek/admin/productsModify', formData, { headers }).subscribe({
      next: () => {
        alert("Termék frissítve!");
        this.isProductEditing = false;
        this.getProductByName();
      },
      error: (err) => alert("Hiba a módosításkor!")
    });
  }

onDeleteProduct(productId: number) {
    if (!confirm("Törli a terméket?")) return;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('http://localhost:3000/api/termek/admin/productDelete', { id: productId }, { headers }).subscribe({
      next: () => { alert("Termék törölve!"); this.foundProduct = null; }
    });
  }

editingOrderId: number | null = null;
editingFoglalasId: number | null = null;

barberList: string[] = [];
serviceList: string[] = [];

loadBarbers(): void {
  this.http.get<any>('http://localhost:3000/api/auth/borbelyokNeve').subscribe({
    next: (res) => {
      if (res.borbelyokNevei && Array.isArray(res.borbelyokNevei)) {
        this.barberList = res.borbelyokNevei;
      } 
      else {
        this.barberList = [];
      }
      console.log('Borbélyok betöltve (admin):', this.barberList);
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Hiba a borbélyok betöltésekor:', err);
      this.barberList = [];
    }
  });
}

services: string[] = [
  'Hajvágás',
  'Szakáll igazítás',
  'Hajfestés',
  'Haj + Szakáll',
  'Melirozás',
  'Melír + Hajvágás',
  'Melír + Haj + Szakáll',
  'Apa + Gyerek kedvezmény'
];

ngOnInit(): void {
  this.loadBarbers();
  this.serviceList = this.services;
}


onEditOrder(order: any) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  this.http.post('http://localhost:3000/api/rendeles/admin/modifyRendeles', order, { headers }).subscribe({
    next: () => {
      alert("Rendelés sikeresen frissítve!");
      this.editingOrderId = null;
    },
    error: (err) => alert("Hiba a mentéskor!")
  });
}

onDeleteOrder(orderId: number) {
  if (!confirm("Biztosan törli ezt a rendelést?")) return;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  this.http.delete(`http://localhost:3000/api/rendeles/admin/deleteRendeles`, { 
    headers, 
    body: { id: orderId } 
  }).subscribe({
    next: () => {
      alert("Rendelés törölve!");
      if (this.foundOrders) this.foundOrders = this.foundOrders.filter(o => o.id !== orderId);
    }
  });
}

onEditFoglalas(fog: any) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  this.http.put('http://localhost:3000/api/foglalas/admin/modifyFoglalas', fog, { headers }).subscribe({
    next: () => {
      alert("Foglalás módosítva!");
      this.editingFoglalasId = null;
    },
    error: (err) => alert("Hiba a foglalás módosításakor!")
  });
}

onDeleteFoglalas(fogId: number) {
  if (!confirm("Biztosan törli ezt a foglalást?")) return;
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  this.http.delete('http://localhost:3000/api/foglalas/admin/foglalasDelete', { headers, body: { id: fogId } }).subscribe({
    next: () => {
      alert("Foglalás törölve!");
      if (this.foundFoglalasok) this.foundFoglalasok = this.foundFoglalasok.filter(f => f.id !== fogId);
    }
  });
}
}
