import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadService } from '../lead.service';
import { Lead } from '../../../models/lead.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ]
})
export class LeadCreateComponent implements OnChanges {
  @Input() leadToEdit?: Lead;
  @Output() saved = new EventEmitter<void>();
  leadForm: FormGroup;
  statusOptions = [
    { value: 'NOVO', label: 'Novo' },
    { value: 'EM_ATENDIMENTO', label: 'Em andamento' },
    { value: 'FINALIZADO', label: 'Finalizado' },
    { value: 'CANCELADO', label: 'Cancelado' }
  ];


  // NOVO: Flag de admin e lista de corretores
  isAdmin = false;
  corretores: { id: number, nome: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private authService: AuthService // Injete seu AuthService aqui!
  ) {
    this.leadForm = this.fb.group({
      id: [null],
      nome: [''],
      email: [''],
      cpfCnpj: [''],
      telefone: [''],
      origem: [''],
      statusLeads: [''],
      observacao: [''],
      corretorId: [null] // Usado somente se admin
    });

    this.isAdmin = this.authService.hasRole('ROLE_ADMIN'); // precisa desse método no AuthService

    // Carrega lista de corretores se for admin
    if (this.isAdmin) {
      this.loadCorretores();
    }
  }

  loadCorretores() {
    this.leadService.listCorretores()
      .subscribe(corretores => this.corretores = corretores);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['leadToEdit'] && this.leadToEdit) {
      this.leadForm.patchValue({
        ...this.leadToEdit,
        corretorId: this.leadToEdit.corretor?.id ?? null, // pega o id do corretor corretamente
        statusLeads: this.leadToEdit.statusLeads ?? ''    // garante que status vai preencher o select
      });
    } else {
      this.leadForm.reset();
    }
  }


  onSubmit() {
    const lead: Lead = this.leadForm.value;
    // Garante que só envia corretorId se for admin
    if (!this.isAdmin) {

    }
    if (lead.id) {
      this.leadService.update(lead).subscribe(() => this.saved.emit());
    } else {
      this.leadService.create(lead).subscribe(() => this.saved.emit());
    }
    this.leadForm.reset();
  }

  clearForm() {
    this.leadForm.reset();
  }
}
