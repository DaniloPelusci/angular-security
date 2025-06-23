import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead.service';
import { Lead } from '../../../models/lead.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  imports: [CommonModule],
  standalone: true
})
export class LeadListComponent implements OnInit {
  leads: Lead[] = [];
  selectedLead?: Lead;
  arquivosSelecionados: File[] = [];

  constructor(
    private leadService: LeadService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.leadService.read().subscribe({
      next: (leads) => this.leads = leads,
      error: (err) => console.error('Erro ao buscar leads:', err)
    });
  }

  onEditLead(lead: Lead) {
    this.selectedLead = { ...lead };
    this.arquivosSelecionados = []; // Limpa arquivos ao trocar de lead
  }

  onSaved() {
    this.selectedLead = undefined;
    this.loadLeads();
    this.arquivosSelecionados = [];
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.arquivosSelecionados = Array.from(target.files);
    }
  }

  enviarArquivos() {
    if (!this.selectedLead || !this.selectedLead.id || this.arquivosSelecionados.length === 0) return;

    const formData = new FormData();
    this.arquivosSelecionados.forEach(file => {
      formData.append('arquivos', file);
    });
    formData.append('leadId', this.selectedLead.id.toString());

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
}
