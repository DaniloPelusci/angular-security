import { Component } from '@angular/core';
import { Lead } from '../../../models/lead.model';
import { LeadSearchComponent } from '../lead-search/lead-search.component';
import { LeadEnderecoListComponent } from '../lead-endereco-list/lead-endereco-list.component';
import { LeadEnderecoFormComponent } from '../lead-endereco-form/lead-endereco-form.component';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {Endereco} from '../../../models/endereco.model';

@Component({
  selector: 'app-lead-endereco',
  templateUrl: './lead-endereco.component.html',
  styleUrls: ['./lead-endereco.component.scss'],
  standalone: true,
  imports: [LeadSearchComponent, LeadEnderecoListComponent, LeadEnderecoFormComponent, MatIconModule, NgIf]
})
export class LeadEnderecoComponent {
  leadSelecionado?: Lead;
  adicionandoEndereco = false; // NOVO
  enderecoEmEdicao?: Endereco | null = null;

  onLeadSelecionado(lead: Lead) {
    this.leadSelecionado = lead;
    this.adicionandoEndereco = false; // Sempre reseta ao selecionar um novo lead
  }

  mostrarFormEndereco() {
    this.adicionandoEndereco = true;
  }

  onEditarEndereco(endereco: Endereco) {
    this.enderecoEmEdicao = { ...endereco };
  }

  onEnderecoSalvo() {
    this.enderecoEmEdicao = null;
    // ... (refresh lista, se quiser)
  }

  onCancelarEdicao() {
    this.enderecoEmEdicao = null;
  }
}
