import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: FormGroup;
  error = '';
  ocupacoes = [
    { label: 'Administrador', value: 'ROLE_ADMIN' },
    { label: 'Usuário', value: 'ROLE_USER' },
    { label: 'Corretor', value: 'ROLE_CORRETOR' },
    { label: 'Correspondente', value: 'ROLE_CORRESPONDENTE' }
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      userName: [''],
      nome: [''],
      email: [''],
      telefone: [''],
      password: [''],
      ocupacoes: [[]]
    });
  }

  register() {
    const user = this.form.value;
    this.auth.register(user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error = 'Erro ao cadastrar usuário'
    });
  }
}
