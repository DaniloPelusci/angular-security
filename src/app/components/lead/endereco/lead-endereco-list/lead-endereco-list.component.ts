import {Component, Input, numberAttribute, OnInit, SimpleChanges} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import {
  MatCell,
  MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { LeadService } from '../../lead.service';
import { Endereco } from '../../../../models/endereco.model';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-lead-endereco-list',
  templateUrl: './lead-endereco-list.component.html',
  imports: [
    MatTable,
    NgIf,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatIconModule,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow
  ],
  standalone: true
})
export class LeadEnderecoListComponent implements OnInit {
  @Input({transform: numberAttribute}) leadId!: number;
  @Output() editarEndereco = new EventEmitter<Endereco>();
  enderecos: Endereco[] = []; // <--- Precisa estar aqui!
  dataSource = new MatTableDataSource<Endereco>([]);
  displayedColumns: string[] = [
    'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep', 'principal', 'acoes'
  ];


  constructor(private leadService: LeadService) {}

  ngOnInit() {
    this.carregarEnderecos();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['leadId'] && this.leadId) {
      this.carregarEnderecos();
    }
  }

  excluirEndereco(endereco: Endereco) {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      this.leadService.deleteEndereco(endereco.id!).subscribe(() => {
        this.carregarEnderecos(); // Atualize a lista
      });
    }
  }

  carregarEnderecos() {
    if (!this.leadId) return;
    this.leadService.listarEnderecosDoLead(this.leadId).subscribe(enderecos => {
      this.enderecos = enderecos;
      this.dataSource.data = enderecos;
    });
  }

  definirComoPrincipal(endereco: Endereco) {
    if (this.leadId && endereco.id) {
      this.leadService.definirEnderecoPrincipal(this.leadId, endereco.id).subscribe(() => {
        this.carregarEnderecos();
      });
    }
  }

}
