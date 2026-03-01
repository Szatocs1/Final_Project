import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KosarService } from './services/kosar.services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public kosarService: KosarService) {}

isBarber(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('User data from localStorage:', user);
      console.log('User role:', user.role);
      return user.role === 'Borbély';
    }
    
    const role = localStorage.getItem('role');
    console.log('Role from localStorage:', role);
    return role === 'Borbély';
  }
}
