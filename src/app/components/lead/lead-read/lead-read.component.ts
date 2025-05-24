import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { LeadReadDataSource, LeadReadItem } from './lead-read-datasource';
import { Lead } from '../../../models/lead.model';
import { LeadService } from '../lead.service';

@Component({
  selector: 'app-lead-read',
  templateUrl: './lead-read.component.html',
  styleUrl: './lead-read.component.css',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule]
})
export class LeadReadComponent implements AfterViewInit {
  leads: Lead[] = [];
  constructor(private leadServe: LeadService) {}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Lead>;
  dataSource = new MatTableDataSource<Lead>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'nome','corretor', 'origem', 'status'];

  ngAfterViewInit(): void {
    console.log('pokemon');
    this.leadServe.read().subscribe(leads => {
      this.leads = leads;
      this.table.dataSource = this.leads;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
  }
  }

