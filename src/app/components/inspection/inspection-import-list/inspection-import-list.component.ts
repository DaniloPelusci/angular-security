import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Inspection } from '../../../models/inspection.model';
import { Inspector } from '../../../models/inspector.model';
import { InspectionService } from '../inspection.service';

@Component({
  selector: 'app-inspection-import-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './inspection-import-list.component.html',
  styleUrl: './inspection-import-list.component.scss'
})
export class InspectionImportListComponent implements AfterViewInit {
  viewMode: 'inspections' | 'inspectors' = 'inspections';
  inspectionColumns: string[] = ['id', 'status', 'worder', 'client', 'name', 'city', 'duedate', 'actions'];
  inspectorColumns: string[] = ['id', 'nome', 'actions'];

  dataSource = new MatTableDataSource<Inspection>([]);
  inspectorsDataSource = new MatTableDataSource<Inspector>([]);

  selectedFile?: File;
  isLoading = false;
  selectedInspectorId?: number;

  inspectionEditing?: Inspection;
  inspectionForInspectorAssign?: Inspection;
  inspectorEditing?: Inspector;

  inspectorForm: Inspector = { nome: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inspectionService: InspectionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    const routeView = this.route.snapshot.data['view'];
    if (routeView === 'inspectors') {
      this.viewMode = 'inspectors';
    }

    this.dataSource.filterPredicate = (data: Inspection, filter: string) => {
      const search = filter.trim().toLowerCase();
      return [data.status, data.worder, data.client, data.name, data.city, data.duedate, data.inspector]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(search));
    };

    this.inspectorsDataSource.filterPredicate = (data: Inspector, filter: string) => {
      const search = filter.trim().toLowerCase();
      return (data.nome || '').toLowerCase().includes(search);
    };
  }

  ngAfterViewInit(): void {
    if (this.viewMode === 'inspections') {
      this.loadInspections();
    }

    this.loadInspectors();
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
        error: () => this.showMessage('Falha ao importar arquivo. Verifique o layout e tente novamente.')
      });
  }

  loadInspections(): void {
    this.isLoading = true;
    this.inspectionService
      .listInspections()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (inspections) => {
          this.dataSource.data = inspections;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => this.showMessage('Não foi possível carregar as inspeções.')
      });
  }

  applyInspectionFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  clearInspectionFilter(): void {
    this.dataSource.filter = '';
  }

  startEditInspection(row: Inspection): void {
    this.inspectionEditing = { ...row };
  }

  cancelEditInspection(): void {
    this.inspectionEditing = undefined;
  }

  saveInspection(): void {
    if (!this.inspectionEditing) {
      return;
    }

    this.inspectionService.updateInspection(this.inspectionEditing).subscribe({
      next: () => {
        this.showMessage('Inspeção atualizada com sucesso.');
        this.inspectionEditing = undefined;
        this.loadInspections();
      },
      error: () => this.showMessage('Erro ao atualizar inspeção.')
    });
  }

  deleteInspection(row: Inspection): void {
    if (!confirm(`Deseja excluir a inspeção #${row.id}?`)) {
      return;
    }

    this.inspectionService.deleteInspection(row.id).subscribe({
      next: () => {
        this.showMessage('Inspeção excluída com sucesso.');
        this.loadInspections();
      },
      error: () => this.showMessage('Erro ao excluir inspeção.')
    });
  }

  openAssignInspector(row: Inspection): void {
    this.inspectionForInspectorAssign = { ...row };
    this.selectedInspectorId = row.inspetorId || undefined;
  }

  assignInspector(): void {
    if (!this.inspectionForInspectorAssign?.id || !this.selectedInspectorId) {
      this.showMessage('Selecione uma inspeção e um inspetor.');
      return;
    }

    this.inspectionService.assignInspector(this.inspectionForInspectorAssign.id, this.selectedInspectorId).subscribe({
      next: () => {
        this.showMessage('Inspetor vinculado com sucesso.');
        this.selectedInspectorId = undefined;
        this.inspectionForInspectorAssign = undefined;
        this.loadInspections();
      },
      error: () => this.showMessage('Erro ao vincular inspetor.')
    });
  }

  loadInspectors(): void {
    this.inspectionService.listInspectors().subscribe({
      next: (inspectors) => {
        this.inspectorsDataSource.data = inspectors;
      },
      error: () => this.showMessage('Não foi possível carregar os inspetores.')
    });
  }

  saveInspector(): void {
    if (!this.inspectorForm.nome.trim()) {
      this.showMessage('Informe o nome do inspetor.');
      return;
    }

    if (this.inspectorForm.id) {
      this.inspectionService.updateInspector(this.inspectorForm).subscribe({
        next: () => {
          this.showMessage('Inspetor atualizado com sucesso.');
          this.resetInspectorForm();
          this.loadInspectors();
        },
        error: () => this.showMessage('Erro ao atualizar inspetor.')
      });
      return;
    }

    this.inspectionService.createInspector(this.inspectorForm).subscribe({
      next: () => {
        this.showMessage('Inspetor criado com sucesso.');
        this.resetInspectorForm();
        this.loadInspectors();
      },
      error: () => this.showMessage('Erro ao criar inspetor.')
    });
  }

  editInspector(row: Inspector): void {
    this.inspectorForm = { ...row };
    this.inspectorEditing = row;
  }

  deleteInspector(row: Inspector): void {
    if (!row.id) {
      return;
    }

    if (!confirm(`Deseja excluir o inspetor ${row.nome}?`)) {
      return;
    }

    this.inspectionService.deleteInspector(row.id).subscribe({
      next: () => {
        this.showMessage('Inspetor excluído com sucesso.');
        this.resetInspectorForm();
        this.loadInspectors();
      },
      error: () => this.showMessage('Erro ao excluir inspetor.')
    });
  }

  cancelInspectorEdit(): void {
    this.resetInspectorForm();
  }

  applyInspectorFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.inspectorsDataSource.filter = filterValue.trim().toLowerCase();
  }

  private resetInspectorForm(): void {
    this.inspectorForm = { nome: '' };
    this.inspectorEditing = undefined;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3500,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
