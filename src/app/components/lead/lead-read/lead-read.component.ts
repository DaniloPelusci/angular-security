import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Lead } from '../../../models/lead.model';
import { LeadService } from '../lead.service';
import {MatIconModule} from '@angular/material/icon';
import {LeadCreateComponent} from '../lead-create/lead-create.component';
import {NgIf} from '@angular/common';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Endereco} from '../../../models/endereco.model';



@Component({
  selector: 'app-lead-read',
  templateUrl: './lead-read.component.html',
  styleUrls: ['./lead-read.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    LeadCreateComponent,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, NgIf, MatFormField, MatLabel, MatFormField, MatInput, MatSuffix, MatIconButton, MatButton]
})
export class LeadReadComponent implements AfterViewInit {
  leads: Lead[] = [];
  selectedLead?: Lead;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;
  dataSource = new MatTableDataSource<Lead>();

  displayedColumns = ['id', 'nome', 'corretor', 'origem', 'status', 'editar'];

  constructor(private leadService: LeadService) {
    this.dataSource.filterPredicate = (data: Lead, filter: string) => {
      filter = filter.trim().toLowerCase();
      return (
        (data.nome?.toLowerCase() || '').includes(filter) ||
        (data.corretor?.nome?.toLowerCase() || '').includes(filter) ||
        (data.origem?.toLowerCase() || '').includes(filter) ||
        (data.statusLeads?.toLowerCase() || '').includes(filter)
      );
    };

  }
  ngAfterViewInit(): void {
    this.loadLeads();
  }

  loadLeads() {
    this.leadService.read().subscribe(leads => {
      this.leads = leads;
      this.dataSource.data = leads;

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  onEditLead(lead: Lead) {
    this.selectedLead = { ...lead };
  }

  onSaved() {
    this.selectedLead = undefined;
    this.loadLeads();
  }

  onNewLead() {
    this.selectedLead = undefined; // Limpa o form para novo
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter() {
    this.dataSource.filter = '';
  }
  enderecoParaEditar: Endereco | null = null;



  abrirFormEndereco(endereco: Endereco) {
    this.enderecoParaEditar = { ...endereco }; // Clona para edição
  }

  aoSalvarEndereco() {
    this.enderecoParaEditar = null;
  }

}
