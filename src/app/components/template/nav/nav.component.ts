import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Adicione isso!
import { AuthService } from '../../../auth/services/auth.service'; 
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule, // <-- Adicione aqui!
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
