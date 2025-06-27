import { Component, Output, EventEmitter } from '@angular/core';
import { LeadService } from '../lead.service';
import { Lead } from '../../../models/lead.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-lead-search',
  standalone: true,
  templateUrl: './lead-search.component.html',
  styleUrls: ['./lead-search.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class LeadSearchComponent {
  @Output() leadSelecionado = new EventEmitter<Lead>();

  buscaCtrl = new FormControl('');
  leadsFiltrados: Lead[] = [];
  allLeads: Lead[] = [];
  displayedColumns: string[] = ['nome', 'cpfCnpj', 'telefone', 'selecionar'];

  constructor(private leadService: LeadService) {
    this.leadService.read().subscribe(leads => {
      this.allLeads = leads;
      this.filtrarLeads();
    });

    this.buscaCtrl.valueChanges.subscribe(() => this.filtrarLeads());
  }

  filtrarLeads() {
    const texto = (this.buscaCtrl.value || '').toLowerCase();
    this.leadsFiltrados = this.allLeads.filter(l =>
      (l.nome || '').toLowerCase().includes(texto) ||
      (l.cpfCnpj || '').includes(texto)
    );
  }

  selecionarLead(lead: Lead) {
    this.leadSelecionado.emit(lead);
    this.buscaCtrl.setValue('');
    this.leadsFiltrados = [];
  }
}
