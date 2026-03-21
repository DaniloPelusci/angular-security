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
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Inspection } from '../../../models/inspection.model';
import { Inspector } from '../../../models/inspector.model';
import { PhotoInspection } from '../../../models/photo-inspection.model';
import {
  FotoNaoProcessada,
  FotoProcessada,
  InspectionZipUploadResponse
} from '../../../models/inspection-zip-upload-response.model';
import { InspectionService } from '../inspection.service';
import { AuthService } from '../../../auth/services/auth.service';

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
  viewMode: 'inspections' | 'inspectors' | 'photos-inspections' | 'photos' | 'inspection-upload' = 'inspections';
  readonly canManageInspectors: boolean;
  inspectionColumns: string[] = ['id', 'status', 'worder', 'client', 'name', 'city', 'duedate', 'actions'];
  inspectorColumns: string[] = ['id', 'nome', 'actions'];
  photosInspectionColumns: string[] = ['id', 'inspectionId', 'photoUrl', 'descricao', 'createdAt'];

  dataSource = new MatTableDataSource<Inspection>([]);
  inspectorsDataSource = new MatTableDataSource<Inspector>([]);
  photosInspectionsDataSource = new MatTableDataSource<PhotoInspection>([]);
  allPhotosInspections: PhotoInspection[] = [];

  selectedFile?: File;
  selectedZipFile?: File;
  isLoading = false;
  selectedInspectorId?: number;
  selectedPhotoInspectorId?: number;
  selectedPhotoInspectionId?: number;
  uploadResult?: InspectionZipUploadResponse;
  processedPhotosDataSource = new MatTableDataSource<FotoProcessada>([]);
  unprocessedPhotosDataSource = new MatTableDataSource<FotoNaoProcessada>([]);
  processedPhotosColumns: string[] = ['arquivo', 'inspectionId', 'substituida'];
  unprocessedPhotosColumns: string[] = ['arquivo', 'motivo'];

  inspectionEditing?: Inspection;
  inspectionForInspectorAssign?: Inspection;
  inspectorEditing?: Inspector;
  photoEditing?: PhotoInspection;
  selectedPhotoFileForUpdate?: File;
  selectedPhotoPreview?: string;
  newPhotoInspectionId?: number;
  newPhotoDescription = '';
  newPhotoFile?: File;

  inspectorForm: Inspector = { nome: '' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inspectionService: InspectionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.canManageInspectors = this.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_CORRETOR']);

    const routeView = this.route.snapshot.data['view'];
    if (routeView === 'inspectors') {
      this.viewMode = 'inspectors';
    }

    if (routeView === 'photos-inspections') {
      this.viewMode = 'photos-inspections';
    }

    if (routeView === 'photos') {
      this.viewMode = 'photos';
    }

    if (routeView === 'inspection-upload') {
      this.viewMode = 'inspection-upload';
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

    this.photosInspectionsDataSource.filterPredicate = (data: PhotoInspection, filter: string) => {
      const search = filter.trim().toLowerCase();
      return [data.id, data.inspectionId, data.photoUrl, data.descricao, data.createdAt]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(search));
    };
  }

  ngAfterViewInit(): void {
    if (this.viewMode === 'inspections') {
      this.loadInspections();
      this.loadInspectors();
      return;
    }

    if (this.viewMode === 'inspectors') {
      this.loadInspectors();
      return;
    }

    if (this.viewMode === 'inspection-upload') {
      return;
    }

    this.photosInspectionColumns = ['id', 'inspectionId', 'photoPreview', 'descricao', 'createdAt', 'actions'];
    this.loadInspections();
    this.loadInspectors();
    this.loadPhotosInspections();
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

  onZipSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedZipFile = input.files?.[0];
  }

  uploadInspectionZip(): void {
    if (!this.selectedZipFile) {
      this.showMessage('Selecione um arquivo .zip para upload.');
      return;
    }

    this.isLoading = true;
    this.inspectionService
      .uploadInspectionZip(this.selectedZipFile)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.uploadResult = response;
          this.processedPhotosDataSource.data = response.fotosProcessadas || [];
          this.unprocessedPhotosDataSource.data = response.fotosNaoProcessadas || [];
          this.showMessage('Upload da inspeção concluído com sucesso.');
          this.selectedZipFile = undefined;
        },
        error: () => this.showMessage('Falha ao enviar ZIP. Verifique o arquivo e tente novamente.')
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
        error: (error) => this.showInspectorPermissionError(error, 'Erro ao atualizar inspetor.')
      });
      return;
    }

    this.inspectionService.createInspector(this.inspectorForm).subscribe({
      next: () => {
        this.showMessage('Inspetor criado com sucesso.');
        this.resetInspectorForm();
        this.loadInspectors();
      },
      error: (error) => this.showInspectorPermissionError(error, 'Erro ao criar inspetor.')
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
      error: (error) => this.showInspectorPermissionError(error, 'Erro ao excluir inspetor.')
    });
  }

  cancelInspectorEdit(): void {
    this.resetInspectorForm();
  }

  applyInspectorFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.inspectorsDataSource.filter = filterValue.trim().toLowerCase();
  }

  get inspectionsForSelectedInspector(): Inspection[] {
    if (!this.selectedPhotoInspectorId) {
      return this.dataSource.data;
    }

    return this.dataSource.data.filter((inspection) => inspection.inspetorId === this.selectedPhotoInspectorId);
  }

  get filteredPhotosInspections(): PhotoInspection[] {
    return this.photosInspectionsDataSource.data;
  }

  onPhotoInspectorFilterChange(): void {
    this.selectedPhotoInspectionId = undefined;
    this.applyPhotoFilter();
  }

  onPhotoInspectionFilterChange(): void {
    this.applyPhotoFilter();
  }

  onPhotoFileForUpdateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedPhotoFileForUpdate = input.files?.[0];
  }

  onNewPhotoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newPhotoFile = input.files?.[0];
  }

  createPhoto(): void {
    if (!this.newPhotoInspectionId || !this.newPhotoFile) {
      this.showMessage('Selecione a inspeção e uma imagem para cadastrar a foto.');
      return;
    }

    this.inspectionService
      .createPhotoInspection(this.newPhotoInspectionId, this.newPhotoFile, this.newPhotoDescription || '')
      .subscribe({
        next: () => {
          this.showMessage('Foto cadastrada com sucesso.');
          this.clearCreatePhotoForm();
          this.loadPhotosInspections();
        },
        error: () => this.showMessage('Não foi possível cadastrar a foto.')
      });
  }

  clearCreatePhotoForm(): void {
    this.newPhotoInspectionId = undefined;
    this.newPhotoDescription = '';
    this.newPhotoFile = undefined;
  }

  openPhotoPreview(row: PhotoInspection): void {
    const preview = this.getPhotoPreview(row);

    if (!preview) {
      this.showMessage('Foto sem visualização disponível.');
      return;
    }

    this.selectedPhotoPreview = preview;
  }

  closePhotoPreview(): void {
    this.selectedPhotoPreview = undefined;
  }

  startEditPhoto(row: PhotoInspection): void {
    this.photoEditing = { ...row };
    this.selectedPhotoFileForUpdate = undefined;
  }

  cancelEditPhoto(): void {
    this.photoEditing = undefined;
    this.selectedPhotoFileForUpdate = undefined;
  }

  savePhotoChanges(): void {
    if (!this.photoEditing?.id || !this.selectedPhotoFileForUpdate) {
      this.showMessage('Selecione uma foto para substituir.');
      return;
    }

    this.inspectionService
      .updatePhotoInspection(this.photoEditing.id, this.selectedPhotoFileForUpdate, this.photoEditing.descricao || '')
      .subscribe({
        next: () => {
          this.showMessage('Foto substituída com sucesso.');
          this.cancelEditPhoto();
          this.loadPhotosInspections();
        },
        error: () => this.showMessage('Não foi possível atualizar a foto.')
      });
  }

  deletePhoto(row: PhotoInspection): void {
    if (!confirm(`Deseja excluir a foto #${row.id}?`)) {
      return;
    }

    this.inspectionService.deletePhotoInspection(row.id).subscribe({
      next: () => {
        this.showMessage('Foto excluída com sucesso.');
        this.loadPhotosInspections();
      },
      error: () => this.showMessage('Não foi possível excluir a foto.')
    });
  }

  getPhotoPreview(photo: PhotoInspection): string | null {
    if (photo.foto) {
      return `data:image/jpeg;base64,${photo.foto}`;
    }

    return photo.photoUrl || null;
  }

  loadPhotosInspections(): void {
    this.isLoading = true;
    this.inspectionService
      .listPhotosInspections()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (photosInspections) => {
          this.allPhotosInspections = photosInspections;
          this.applyPhotoFilter();
        },
        error: () => this.showMessage('Não foi possível carregar as fotos de inspeções.')
      });
  }

  applyPhotosInspectionsFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.photosInspectionsDataSource.filter = filterValue.trim().toLowerCase();
  }

  private applyPhotoFilter(): void {
    const filtered = this.allPhotosInspections.filter((photo) => {
      if (this.selectedPhotoInspectionId) {
        return photo.inspectionId === this.selectedPhotoInspectionId;
      }

      if (this.selectedPhotoInspectorId) {
        return this.inspectionsForSelectedInspector.some((inspection) => inspection.id === photo.inspectionId);
      }

      return true;
    });

    this.photosInspectionsDataSource.data = filtered;
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

  private showInspectorPermissionError(error: unknown, fallbackMessage: string): void {
    if (error instanceof HttpErrorResponse && error.status === 403) {
      this.showMessage('Você não possui permissão para cadastrar, editar ou excluir inspetores.');
      return;
    }

    this.showMessage(fallbackMessage);
  }
}
