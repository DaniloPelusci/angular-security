import {Component, Input, numberAttribute, OnInit} from '@angular/core';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { LeadService } from '../lead.service';
import { Endereco } from '../../../models/endereco.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-lead-endereco-list',
  templateUrl: './lead-endereco-list.component.html',
  imports: [
    MatTable,
    NgIf
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
