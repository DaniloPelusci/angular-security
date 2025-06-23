import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Lead } from '../../../models/lead.model';
import { LeadService } from '../lead.service';
import {MatIconModule} from '@angular/material/icon';
import {LeadCreateComponent} from '../lead-create/lead-create.component';



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
    MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule]
})
export class LeadReadComponent implements AfterViewInit {
  leads: Lead[] = [];
  selectedLead?: Lead;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;
  dataSource = new MatTableDataSource<Lead>();

  displayedColumns = ['id', 'nome', 'corretor', 'origem', 'status', 'editar','documentos'];

  constructor(private leadService: LeadService) {}

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
}
