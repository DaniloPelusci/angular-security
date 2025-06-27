import { Component } from '@angular/core';
import { Lead } from '../../../models/lead.model';
import { LeadSearchComponent } from '../lead-search/lead-search.component';
import { LeadEnderecoListComponent } from '../lead-endereco-list/lead-endereco-list.component';
import { LeadEnderecoFormComponent } from '../lead-endereco-form/lead-endereco-form.component';
import {MatIconModule} from '@angular/material/icon';
import {NgIf} from '@angular/common';

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

  onLeadSelecionado(lead: Lead) {
    this.leadSelecionado = lead;
    this.adicionandoEndereco = false; // Sempre reseta ao selecionar um novo lead
  }

  mostrarFormEndereco() {
    this.adicionandoEndereco = true;
  }

  onEnderecoSalvo() {
    this.adicionandoEndereco = false;
    // aqui você pode acionar o refresh da lista, se necessário
  }
}
