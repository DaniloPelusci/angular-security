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
    { label: 'Lista', icon: 'list', route: '/read', roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] },
    { label: 'Lista Leads Aptos', icon: 'list', route: '/listCorrespondente', roles: ['ROLE_ADMIN', 'ROLE_CORRESPONDENTE'] },
    { label: 'Criar lead', icon: 'note_add', route: 'lead/completo', roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] },
    { label: 'Documentos', icon: 'upload', route: '/leads/documento', roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] },
    { label: 'Endereco Lead', icon: 'create', route: '/endreco', roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] },
    { label: 'Usuários', icon: 'people', route: '/users', roles: ['ROLE_ADMIN'] },
    { label: 'Cadastrar Usuário', icon: 'person_add', route: '/register', roles: ['ROLE_ADMIN'] }  ];

  logout() {
    this.authService.logout();
  }
}
