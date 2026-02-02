import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // Ha később validációt is akarsz

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [CommonModule, RouterModule, ReactiveFormsModule] // Fontos importok!
})
export class Register {
    // Itt kezelheted majd a regisztrációs logikát
}