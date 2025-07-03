import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { LeadService } from '../lead.service';
import { Lead } from '../../../models/lead.model';
import { LeadSearchComponent } from '../endereco/lead-search/lead-search.component';

@Component({
  selector: 'app-solicitar-documento',
  standalone: true,
  imports: [CommonModule, LeadSearchComponent, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './solicitar-documento.component.html',
  styleUrls: ['./solicitar-documento.component.scss']
})
export class SolicitarDocumentoComponent {
  selectedLead?: Lead;
  linkGerado = '';
  constructor(private leadService: LeadService) {}

  gerarLink() {
    if (!this.selectedLead) { return; }
    this.leadService.solicitarDocumentos(this.selectedLead.id!).subscribe((resp: any) => {
      this.linkGerado = resp.link;
    });
  }
}
