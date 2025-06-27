import {Component, Input, numberAttribute, OnInit} from '@angular/core';
import {
  MatCell,
  MatCellDef, MatColumnDef, MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { LeadService } from '../lead.service';
import { Endereco } from '../../../models/endereco.model';
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
  enderecos: Endereco[] = []; // <--- Precisa estar aqui!
  dataSource = new MatTableDataSource<Endereco>([]);
  displayedColumns: string[] = [
    'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep', 'principal'
  ];


  constructor(private leadService: LeadService) {}

  ngOnInit() {
    this.carregarEnderecos();
  }

  carregarEnderecos() {
    if (!this.leadId) return;
    this.leadService.listarEnderecosDoLead(this.leadId).subscribe(enderecos => {
      this.enderecos = enderecos;
      this.dataSource.data = enderecos;
    });
  }
}
