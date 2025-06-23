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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../auth/services/auth.service';

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
  isAdmin = false;
  corretores: { id: number, nome: string }[] = [];

  arquivosSelecionados: File[] = []; // Novo: array para arquivos

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private authService: AuthService,
    private snackBar: MatSnackBar // Agora injeta o snackBar!
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
      corretorId: [null]
    });

    this.isAdmin = this.authService.hasRole('ROLE_ADMIN');

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
        corretorId: this.leadToEdit.corretor?.id ?? null,
        statusLeads: this.leadToEdit.statusLeads ?? ''
      });
    } else {
      this.leadForm.reset();
    }
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.arquivosSelecionados = Array.from(target.files);
    }
  }

  // Chame esse método após o lead já existir no banco!
  enviarArquivos() {
    const leadId = this.leadForm.get('id')?.value;
    if (!leadId || this.arquivosSelecionados.length === 0) return;

    const formData = new FormData();
    this.arquivosSelecionados.forEach(file => {
      formData.append('arquivos', file);
    });
    formData.append('leadId', leadId.toString());

    this.leadService.uploadDocumentos(formData).subscribe({
      next: () => {
        this.arquivosSelecionados = [];
        this.snackBar.open('Arquivos enviados com sucesso!', '', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Falha ao enviar arquivos.', '', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    const lead: Lead = this.leadForm.value;
    if (lead.id) {
      this.leadService.update(lead).subscribe(() => this.saved.emit());
    } else {
      this.leadService.create(lead).subscribe(novoLead => {
        this.leadForm.patchValue({ id: novoLead.id }); // Atualiza o form para liberar upload
        this.saved.emit();
      });
    }
    // Não limpe o form imediatamente após criar, para não perder o ID!
    // this.leadForm.reset();
  }

  clearForm() {
    this.leadForm.reset();
    this.arquivosSelecionados = [];
  }
}
