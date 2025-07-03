import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import {PermissionModel} from '../../models/Permission.model';
import {MatCard} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {UserService} from '../../components/user/user.service';

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
  isEditing = false;
  editingUserId?: number;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
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

    const idParam = this.route.snapshot.queryParamMap.get('userId');
    if (idParam) {
      this.isEditing = true;
      this.editingUserId = +idParam;
      this.userService.getById(this.editingUserId).subscribe({
        next: user => {
          this.form.patchValue({
            userName: user.username || '',
            nome: user.nome || '',
            email: user.email || '',
            telefone: user.telefone || '',
            permissions: user.authorities?.map(a => ({ description: a.authority })) || []
          });
        },
        error: () => this.error = 'Erro ao carregar usuário'
      });
    }
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
    if (this.isEditing && this.editingUserId) {
      this.userService.update(this.editingUserId, user).subscribe({
        next: () => this.router.navigate(['/users']),
        error: () => this.error = 'Erro ao atualizar usuário'
      });
    } else {
      this.auth.register(user).subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => this.error = 'Erro ao cadastrar usuário'
      });
    }
  }
}
