import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatTableModule
  ],
  templateUrl: './inspection-search.component.html',
  styleUrl: './inspection-search.component.scss'
})
export class InspectionSearchComponent implements OnInit {
  searchMode: 'worder' | 'otype' = 'worder';

  inspectorId?: number;
  searchValue = '';
  isLoading = false;

  inspectors: Inspector[] = [];
  inspectionsDataSource = new MatTableDataSource<Inspection>([]);
  photosDataSource = new MatTableDataSource<PhotoInspection>([]);

  selectedPhotoPreview?: string;

  readonly inspectionColumns = ['id', 'status', 'worder', 'otype', 'client', 'name', 'city'];
  readonly photoColumns = ['id', 'inspectionId', 'descricao', 'preview'];

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

  loadInspectors(): void {
    this.inspectionService.listInspectors().subscribe({
      next: (inspectors) => {
        this.inspectors = inspectors;
      },
      error: () => this.showMessage('Não foi possível carregar os inspetores.')
    });
  }

  searchByInspectorAndWorder(): void {
    this.searchMode = 'worder';
    this.searchInspections();
  }

  searchByInspectorAndOtype(): void {
    this.searchMode = 'otype';
    this.searchInspections();
  }

  onKeydownSearch(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchInspections();
    }
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

  getPhotoPreview(photo: PhotoInspection): string | null {
    if (photo.foto) {
      return `data:image/jpeg;base64,${photo.foto}`;
    }

    return photo.photoUrl || null;
  }

  private searchInspections(): void {
    this.isLoading = true;

    const request$ = this.searchMode === 'worder'
      ? this.inspectionService.listInspectionsByWorder(this.inspectorId, this.searchValue)
      : this.inspectionService.listInspectionsByOtype(this.inspectorId, this.searchValue);

    request$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (inspections) => {
          this.inspectionsDataSource.data = inspections;
          this.loadPhotosByInspections(inspections);
        },
        error: () => {
          this.inspectionsDataSource.data = [];
          this.photosDataSource.data = [];
          this.showMessage('Não foi possível pesquisar as inspeções.');
        }
      });
  }

  private loadPhotosByInspections(inspections: Inspection[]): void {
    if (!inspections.length) {
      this.photosDataSource.data = [];
      return;
    }

    this.inspectionService.listPhotosByInspections(inspections).subscribe({
      next: (photos) => {
        this.photosDataSource.data = photos;
      },
      error: () => {
        this.photosDataSource.data = [];
        this.showMessage('Não foi possível carregar as fotos para as inspeções encontradas.');
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
