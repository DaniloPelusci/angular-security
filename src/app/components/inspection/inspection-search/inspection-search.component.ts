import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import { Inspection } from '../../../models/inspection.model';
import { Inspector } from '../../../models/inspector.model';
import { PhotoInspection } from '../../../models/photo-inspection.model';
import { InspectionService } from '../inspection.service';

@Component({
  selector: 'app-inspection-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './inspection-search.component.html',
  styleUrl: './inspection-search.component.scss'
})
export class InspectionSearchComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  searchMode: 'worder' | 'otype' = 'worder';

  inspectorId?: number;
  searchValue = '';
  isLoading = false;
  isLoadingPhotos = false;

  inspectors: Inspector[] = [];
  inspectionsDataSource = new MatTableDataSource<Inspection>([]);
  photosDataSource = new MatTableDataSource<PhotoInspection>([]);

  selectedInspectionId?: number;
  selectedInspection?: Inspection;
  selectedPhotoPreview?: string;
  photoEditing?: PhotoInspection;
  selectedPhotoFileForUpdate?: File;
  isSavingPhoto = false;
  readonly pageSizeOptions = [5, 10, 15, 20];

  readonly inspectionColumns = ['id', 'status', 'worder', 'otype', 'client', 'name', 'city', 'actions'];
  readonly photoColumns = ['id', 'inspectionId', 'descricao', 'preview'];
  readonly inspectionDetailsFields: Array<{ key: keyof Inspection; label: string }> = [
    { key: 'id', label: 'ID' },
    { key: 'status', label: 'Status' },
    { key: 'worder', label: 'Worder' },
    { key: 'otype', label: 'Otype' },
    { key: 'inspetorId', label: 'ID do Inspetor' },
    { key: 'inspector', label: 'Inspetor' },
    { key: 'client', label: 'Cliente' },
    { key: 'name', label: 'Nome' },
    { key: 'address1', label: 'Endereço 1' },
    { key: 'address2', label: 'Endereço 2' },
    { key: 'city', label: 'Cidade' },
    { key: 'zip', label: 'CEP' },
    { key: 'duedate', label: 'Vencimento' },
    { key: 'rush', label: 'Rush' },
    { key: 'followup', label: 'Follow Up' },
    { key: 'vacant', label: 'Vacant' },
    { key: 'mortgage', label: 'Mortgage' },
    { key: 'vandalism', label: 'Vandalism' },
    { key: 'freezeFlag', label: 'Freeze Flag' },
    { key: 'storm', label: 'Storm' },
    { key: 'roof', label: 'Roof' },
    { key: 'water', label: 'Water' },
    { key: 'naturalFlag', label: 'Natural Flag' },
    { key: 'fire', label: 'Fire' },
    { key: 'hazard', label: 'Hazard' },
    { key: 'structure', label: 'Structure' },
    { key: 'mold', label: 'Mold' },
    { key: 'pump', label: 'Pump' }
  ];

  constructor(
    private inspectionService: InspectionService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const mode = this.route.snapshot.data['mode'];
    if (mode === 'otype') {
      this.searchMode = 'otype';
    }

    this.loadInspectors();
  }

  ngAfterViewInit(): void {
    this.inspectionsDataSource.paginator = this.paginator ?? null;
  }

  get searchTitle(): string {
    return this.searchMode === 'worder' ? 'Pesquisa por Worder' : 'Pesquisa por Otype';
  }

  get searchLabel(): string {
    return this.searchMode === 'worder' ? 'Worder' : 'Otype';
  }

  get searchPlaceholder(): string {
    return this.searchMode === 'worder' ? 'Digite o worder' : 'Digite o otype';
  }

  loadInspectors(): void {
    this.inspectionService.listInspectors().subscribe({
      next: (inspectors) => {
        this.inspectors = inspectors;
      },
      error: () => this.showMessage('Não foi possível carregar os inspetores.')
    });
  }

  search(): void {
    this.searchInspections();
  }

  onKeydownSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchInspections();
    }
  }

  selectInspection(inspection: Inspection): void {
    if (!inspection.id) {
      this.showMessage('Inspeção inválida para carregar fotos.');
      return;
    }

    this.selectedInspectionId = inspection.id;
    this.selectedInspection = inspection;
    this.photoEditing = undefined;
    this.photosDataSource.data = [];
    this.isLoadingPhotos = true;

    this.inspectionService.listPhotosByInspections([inspection]).pipe(
      finalize(() => (this.isLoadingPhotos = false))
    ).subscribe({
      next: (photos) => {
        this.photosDataSource.data = photos;
      },
      error: () => {
        this.photosDataSource.data = [];
        this.showMessage('Não foi possível carregar as fotos da inspeção selecionada.');
      }
    });
  }

  openPhotoPopup(photo: PhotoInspection): void {
    const preview = this.getPhotoPreview(photo);
    if (!preview) {
      this.showMessage('Foto sem visualização disponível.');
      return;
    }

    this.selectedPhotoPreview = preview;
  }

  closePhotoPopup(): void {
    this.selectedPhotoPreview = undefined;
  }

  startEditPhoto(photo: PhotoInspection): void {
    this.photoEditing = { ...photo };
    this.selectedPhotoFileForUpdate = undefined;
  }

  cancelEditPhoto(): void {
    this.photoEditing = undefined;
    this.selectedPhotoFileForUpdate = undefined;
  }

  onPhotoFileForUpdateSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedPhotoFileForUpdate = input.files?.[0];
  }

  savePhotoReplacement(): void {
    if (!this.photoEditing?.id || !this.selectedPhotoFileForUpdate) {
      this.showMessage('Selecione uma nova imagem para substituir a foto atual.');
      return;
    }

    this.isSavingPhoto = true;
    this.inspectionService
      .updatePhotoInspection(this.photoEditing.id, this.selectedPhotoFileForUpdate, this.photoEditing.descricao || '')
      .pipe(finalize(() => (this.isSavingPhoto = false)))
      .subscribe({
        next: (updatedPhoto) => {
          this.photosDataSource.data = this.photosDataSource.data.map((photo) =>
            photo.id === updatedPhoto.id ? { ...photo, ...updatedPhoto } : photo
          );
          this.photoEditing = undefined;
          this.selectedPhotoFileForUpdate = undefined;
          this.showMessage('Foto substituída com sucesso.');
        },
        error: () => this.showMessage('Não foi possível substituir a foto.')
      });
  }

  getPhotoPreview(photo: PhotoInspection): string | null {
    if (photo.foto) {
      return `data:image/jpeg;base64,${photo.foto}`;
    }

    return photo.photoUrl || null;
  }

  isInspectionSelected(inspection: Inspection): boolean {
    return Boolean(inspection.id && inspection.id === this.selectedInspectionId);
  }

  getInspectionFieldValue(inspection: Inspection, key: keyof Inspection): string | number {
    const value = inspection[key];
    return value !== null && value !== undefined && value !== '' ? value : '-';
  }

  private searchInspections(): void {
    this.isLoading = true;
    this.selectedInspectionId = undefined;
    this.selectedInspection = undefined;
    this.photoEditing = undefined;
    this.photosDataSource.data = [];

    const request$ = this.searchMode === 'worder'
      ? this.inspectionService.listInspectionsByWorder(this.inspectorId, this.searchValue)
      : this.inspectionService.listInspectionsByOtype(this.inspectorId, this.searchValue);

    request$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (inspections) => {
          this.inspectionsDataSource.data = inspections;
          if (this.paginator) {
            this.paginator.firstPage();
          }
        },
        error: () => {
          this.inspectionsDataSource.data = [];
          this.photosDataSource.data = [];
          this.showMessage('Não foi possível pesquisar as inspeções.');
        }
      });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3500,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
