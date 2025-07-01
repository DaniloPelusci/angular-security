import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Lead } from '../../../../models/lead.model';
import { LeadService } from '../../lead.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {NgIf} from '@angular/common';



@Component({
  selector: 'app-lead-correspondente-read',
  templateUrl: './lead-read-correspondente.component.html',
  styleUrls: ['./lead-read-correspondente.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule, MatButton, MatFormField, MatIconButton, MatInput, MatLabel, MatSuffix, NgIf, MatFormField]
})
export class LeadReadCorrespondenteComponent implements AfterViewInit {
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
    this.leadService.listCorrespondent().subscribe(leads => {
      this.leads = leads;
      this.dataSource.data = leads;
      // Se for paginado/sorted, adicione abaixo
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  onEditLead(lead: Lead) {
    this.selectedLead = { ...lead };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter() {
    this.dataSource.filter = '';
  }
}
