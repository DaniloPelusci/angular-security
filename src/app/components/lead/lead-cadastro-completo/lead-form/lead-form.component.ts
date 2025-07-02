import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {AuthService} from '../../../../auth/services/auth.service';
import {LeadService} from '../../lead.service';
// ...restante dos imports

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatOption,
    MatSelect
  ]
})
export class LeadFormComponent implements OnInit {
  @Output() submitLead = new EventEmitter<any>();
  @Output() leadChange = new EventEmitter<any>();

  leadForm: FormGroup;
  statusOptions = [
    { value: 'NOVO', label: 'Novo' },
    { value: 'EM_ATENDIMENTO', label: 'Em andamento' },
    { value: 'FINALIZADO', label: 'Finalizado' },
    { value: 'CANCELADO', label: 'Cancelado' }
  ];
  isAdmin = false;
  corretores: { id: number, nome: string }[] = [];

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private leadService: LeadService) {
    this.leadForm = this.fb.group({
      nome: ['', Validators.required],
      email: [''],
      cpfCnpj: [''],
      telefone: [''],
      origem: [''],
      statusLeads: [''],
      observacao: [''],
      corretorId: [null]
    });

    this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
    if (this.isAdmin) {
      this.loadCorretores();
    }
  }

  ngOnInit() {
    this.leadForm.valueChanges.subscribe(value => {
      this.leadChange.emit(value);
    });
  }

  onSubmit() {
    if (this.leadForm.valid) {
      this.submitLead.emit(this.leadForm.value);
    }
  }

  loadCorretores() {
    this.leadService.listCorretores().subscribe(corretores => this.corretores = corretores);
  }
}
