import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Lead } from '../../../../models/lead.model';
import { LeadService } from '../../lead.service';
import {MatIconModule} from '@angular/material/icon';



@Component({
  selector: 'app-lead-correspondente-read',
  templateUrl: './lead-read-correspondente.component.html',
  styleUrls: ['./lead-read-correspondente.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule]
})
export class LeadReadCorrespondenteComponent implements AfterViewInit {
  leads: Lead[] = [];
  selectedLead?: Lead;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;
  dataSource = new MatTableDataSource<Lead>();

  displayedColumns = ['id', 'nome', 'corretor', 'origem', 'status', 'editar'];

  constructor(private leadService: LeadService) {}

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
}
