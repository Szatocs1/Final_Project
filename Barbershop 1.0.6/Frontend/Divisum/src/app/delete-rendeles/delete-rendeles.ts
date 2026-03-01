import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-rendeles',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatIconModule],
  providers: [DatePipe],
  templateUrl: './delete-rendeles.html',
  styleUrl: './delete-rendeles.css'
})
export class DeleteRendeles {
  searchId: string = '';
  foundRendeles: any = null;
  loading: boolean = false;

  constructor(
    private http: HttpClient, 
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {}

  searchRendeles() {
    if (!this.searchId.trim()) return;
    this.loading = true;
    this.foundRendeles = null;

    const payload = {
      id: this.searchId,
    }

    this.http.post<any>('http://localhost:3000/api/rendeles/getRendelesById', payload)
      .subscribe({
        next: (res) => {
          this.foundRendeles = res.rendeles || res;
          console.log(this.foundRendeles)
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Hiba:", err);
          alert("Nincs ilyen azonosítójú rendelés!");
          this.loading = false;
        }
      });
  }

  triggerDeleteAlert() {
    if (!this.foundRendeles) return;

    const nev = this.foundRendeles.vasarloNeve || 'Ismeretlen';
    const datum = this.datePipe.transform(this.foundRendeles.rendelesIdeje, 'yyyy.MM.dd. HH:mm') || '';
    const osszeg = this.foundRendeles.ar || 0;

    setTimeout(() => {
      const uzenet = `BIZTONSÁGI MEGERŐSÍTÉS\n\n` +
                     `Biztosan törölni akarod ezt a rendelést?\n\n` +
                     `Név: ${nev}\n` +
                     `Dátum: ${datum}\n` +
                     `Összeg: ${osszeg} Ft\n\n` +
                     `A művelet nem vonható vissza!`;

      if (window.confirm(uzenet)) {
        this.deleteRendeles();
      }
    }, 10);
  }

  private deleteRendeles() {
    const idToDelete = this.foundRendeles.id;

    this.http.delete('http://localhost:3000/api/rendeles/rendelesDelete', { 
      body: { id: idToDelete } 
    }).subscribe({
      next: () => {
        alert("Sikeres törlés!");
        this.foundRendeles = null;
        this.searchId = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Törlési hiba:", err);
        alert("Hiba történt a törlés során!");
      }
    });
  }
}