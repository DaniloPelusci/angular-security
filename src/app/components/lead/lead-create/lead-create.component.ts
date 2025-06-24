import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadService } from '../lead.service';
import { Lead } from '../../../models/lead.model';
import { FormsModule } from '@angular/forms';

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
import {DocumentoLead} from '../../../models/documentoLead.model';
// ... (imports iguais)

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
    FormsModule,
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

  tiposDocumento = [
    { value: 1, label: 'Comprovante de Endereço' },
    { value: 2, label: 'RG' },
    { value: 3, label: 'CPF' },
    { value: 4, label: 'Contracheque' }
    // Troque pelos IDs corretos do seu banco!
  ];


  isAdmin = false;
  corretores: { id: number, nome: string }[] = [];
  arquivosParaUpload: { file: File, tipoDocumentoId: number | null }[] = [];
  documentos: DocumentoLead[] = [];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private authService: AuthService,
    private snackBar: MatSnackBar
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
      // Carregar documentos do lead selecionado
      if (this.leadToEdit.id) {
        this.leadService.getDocumentosDoLead(this.leadToEdit.id)
          .subscribe(docs => this.documentos = docs);
      } else {
        this.documentos = [];
      }
    } else {
      this.leadForm.reset();
      this.arquivosParaUpload = [];
      this.documentos = [];
    }
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.arquivosParaUpload = Array.from(target.files).map(file => ({
        file,
        tipoDocumentoId: null
      }));
    }
  }

  enviarArquivos() {
    const leadId = this.leadForm.get('id')?.value;
    if (!leadId || this.arquivosParaUpload.length === 0) return;

    // Garante que todos os arquivos têm tipo
    if (this.arquivosParaUpload.some(item => !item.tipoDocumentoId)) {
      this.snackBar.open('Selecione o tipo para todos os arquivos!', '', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    this.arquivosParaUpload.forEach(item => {
      formData.append('arquivos', item.file);
      formData.append('tiposDocumentoId', item.tipoDocumentoId!.toString());
    });
    formData.append('leadId', leadId.toString());

    this.leadService.uploadDocumentos(formData).subscribe({
      next: () => {
        this.arquivosParaUpload = [];
        this.snackBar.open('Arquivos enviados com sucesso!', '', { duration: 3000 });
        // Recarrega lista de documentos após upload
        this.leadService.getDocumentosDoLead(leadId)
          .subscribe(docs => this.documentos = docs);
      },
      error: () => {
        this.snackBar.open('Falha ao enviar arquivos.', '', { duration: 3000 });
      }
    });
  }

  baixarDocumento(id: number, nomeArquivo: string) {
    this.leadService.downloadDocumento(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  onSubmit() {
    const lead: Lead = this.leadForm.value;
    if (lead.id) {
      this.leadService.update(lead).subscribe(() => this.saved.emit());
    } else {
      this.leadService.create(lead).subscribe(novoLead => {
        this.leadForm.patchValue({ id: novoLead.id });
        this.saved.emit();
      });
    }
    // Não limpe o form imediatamente após criar, para não perder o ID!
  }

  clearForm() {
    this.leadForm.reset();
    this.arquivosParaUpload = [];
    this.documentos = [];
  }
  isUploadDisabled(): boolean {
    return (
      this.arquivosParaUpload.length === 0 ||
      this.arquivosParaUpload.some(item => !item.tipoDocumentoId) ||
      !this.leadForm.get('id')?.value
    );
  }

  isDataVencida(dataEmissao: string | Date): boolean {
    if (!dataEmissao) return false;
    const data = new Date(dataEmissao);
    const agora = new Date();
    // Data há 3 meses atrás
    const limite = new Date(agora.getFullYear(), agora.getMonth() - 3, agora.getDate());
    return data < limite;
  }
  deletarDocumento(id: number) {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;
    this.leadService.deletarDocumento(id).subscribe({
      next: () => {
        this.snackBar.open('Documento excluído com sucesso!', '', { duration: 3000 });
        // Recarrega a lista
        const leadId = this.leadForm.get('id')?.value;
        if (leadId) {
          this.leadService.getDocumentosDoLead(leadId).subscribe(docs => this.documentos = docs);
        }
      },
      error: () => {
        this.snackBar.open('Erro ao excluir documento!', '', { duration: 3000 });
      }
    });
  }


}

