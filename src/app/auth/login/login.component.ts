import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class LoginComponent {
  form = this.fb.group({
    username: [''],
    password: ['']
  });
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  login() {
    const username = this.form.get('username')?.value ?? '';
    const password = this.form.get('password')?.value ?? '';
    this.auth.login({ username, password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error = 'Usuário ou senha inválidos'
    });
  }
}
