import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
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

  canShow(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  menuItems = [
    { label: 'Início', icon: 'home', route: '/dashboard', roles: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_CORRETOR'] },
    { label: 'Inspeções', icon: 'fact_check', route: '/inspections', roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] },
    { label: 'Cadastro de inspetor', icon: 'badge', route: '/inspectors', roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] },
    { label: 'Fotos de inspeções', icon: 'photo_library', route: '/photos-inspections', roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] },
    { label: 'Upload de inspeção', icon: 'folder_zip', route: '/inspection-upload', roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] },
    { label: 'Usuários', icon: 'people', route: '/users', roles: ['ROLE_ADMIN'] },
    { label: 'Cadastrar Usuário', icon: 'person_add', route: '/register', roles: ['ROLE_ADMIN'] }  ];

  logout() {
    this.authService.logout();
  }
}
