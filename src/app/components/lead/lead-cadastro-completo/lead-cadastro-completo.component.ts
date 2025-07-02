import { Component } from '@angular/core';
import { Lead } from '../../../models/lead.model';
import { Endereco } from '../../../models/endereco.model';
import {LeadService} from '../lead.service';
import {MatCard} from '@angular/material/card';
import {LeadFormComponent} from './lead-form/lead-form.component';
import {EnderecoFormComponent} from './endereco-form/endereco-form.component';
import {DocumentoFormComponent} from './documento-form/documento-form.component';
import {LeadCadastroCompletoDTO} from '../../../models/dto/leadCadastroCompletoDTO';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-lead-cadastro-completo',
  templateUrl: './lead-cadastro-completo.component.html',
  styleUrls: ['./lead-cadastro-completo.component.scss'],
  imports: [
    MatCard,
    LeadFormComponent,
    EnderecoFormComponent,
    MatButton
  ],
  standalone: true
})
export class LeadCadastroCompletoComponent {
  lead: Lead | null = null;
  endereco: Endereco | null = null;
  documentos: any[] = [];

  constructor(private leadService: LeadService) {}

  onLeadChange(lead: any) {
    this.lead = lead;
  }
  onEnderecosChange(endereco: Endereco) {
    this.endereco = endereco;
  }
  onDocumentosChange(documentos: any[]) {
    this.documentos = documentos;
  }

  cadastrarCompleto() {
    const payload: LeadCadastroCompletoDTO = {
      lead: this.lead,
      endereco: this.endereco,
      documentos: this.documentos
    };
    this.leadService.cadastrarCompleto(payload).subscribe(() => {
      // ações após cadastro
    });
  }
}
