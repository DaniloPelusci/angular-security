import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import {PermissionModel} from '../../models/Permission.model';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule, MatFormField, MatCard, MatOption, MatSelect, MatButton, MatInput, MatLabel],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  error = '';
  permissionsOptions: PermissionModel[] = [];

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
      permissions: [[]]
    });
  }

  ngOnInit() {
    this.auth.getPermissions().subscribe({
      next: (perms) => this.permissionsOptions = perms,
      error: () => this.error = 'Erro ao carregar permissões'
    });
  }

  register() {
    const user = this.form.value as {
      userName: string;
      nome: string;
      email: string;
      telefone: string;
      password: string;
      permissions: PermissionModel[];
    };
    this.auth.register(user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error = 'Erro ao cadastrar usuário'
    });
  }
}
