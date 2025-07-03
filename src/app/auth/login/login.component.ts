import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, MatButton, RouterLink]
})
export class LoginComponent {
  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  login() {
    const username = this.form.get('username')?.value ?? '';
    const password = this.form.get('password')?.value ?? '';
    this.auth.login({ username, password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error = 'Usuário ou senha inválidos'
    });
  }
}
