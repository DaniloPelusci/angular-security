import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { Inspection } from '../../../models/inspection.model';
import { InspectionService } from '../inspection.service';

@Component({
  selector: 'app-inspection-import-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './inspection-import-list.component.html',
  styleUrl: './inspection-import-list.component.scss'
})
export class InspectionImportListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'status',
    'worder',
    'client',
    'name',
    'city',
    'duedate'
  ];
  dataSource = new MatTableDataSource<Inspection>([]);
  selectedFile?: File;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inspectionService: InspectionService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.filterPredicate = (data: Inspection, filter: string) => {
      const search = filter.trim().toLowerCase();
      return [
        data.status,
        data.worder,
        data.client,
        data.name,
        data.city,
        data.duedate,
        data.inspector
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(search));
    };
  }

  ngAfterViewInit(): void {
    this.loadInspections();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0];
  }

  importExcel(): void {
    if (!this.selectedFile) {
      this.showMessage('Selecione um arquivo Excel (.xlsx ou .xls).');
      return;
    }

    this.isLoading = true;
    this.inspectionService
      .uploadExcel(this.selectedFile)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.showMessage('Arquivo importado com sucesso!');
          this.selectedFile = undefined;
          this.loadInspections();
        },
        error: () => {
          this.showMessage('Falha ao importar arquivo. Verifique o layout e tente novamente.');
        }
      });
  }

  loadInspections(): void {
    this.isLoading = true;
    this.inspectionService
      .list()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (inspections) => {
          this.dataSource.data = inspections;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          this.showMessage('Não foi possível carregar as inspeções.');
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter(): void {
    this.dataSource.filter = '';
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3500,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
