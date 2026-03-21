import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Inspection } from '../../models/inspection.model';
import { Inspector } from '../../models/inspector.model';
import { PhotoInspection } from '../../models/photo-inspection.model';
import { InspectionZipUploadResponse } from '../../models/inspection-zip-upload-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private readonly inspectionsApiUrl = `${environment.apiBaseUrl}/api/inspections`;
  private readonly inspectorsApiUrl = `${environment.apiBaseUrl}/api/inspetores`;
  private readonly inspectorsApiUrlFallback = `${environment.apiBaseUrl}/api/inspectors`;
  private readonly photosInspectionsApiUrl = `${environment.apiBaseUrl}/api/foto-inspections`;
  private readonly photoInspectionsImportApiUrl = `${environment.apiBaseUrl}/api/foto-inspections/import-zip`;

  constructor(private http: HttpClient) {}

  listInspections(): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(this.inspectionsApiUrl);
  }

  listInspectionsByWorder(inspetorId?: number, worder?: string): Observable<Inspection[]> {
    let params = new HttpParams();

    if (inspetorId) {
      params = params.set('inspetorId', String(inspetorId));
    }

    if (worder?.trim()) {
      params = params.set('worder', worder.trim());
    }

    return this.http.get<Inspection[]>(`${this.inspectionsApiUrl}/por-worder`, { params });
  }

  listInspectionsByOtype(inspetorId?: number, otype?: string): Observable<Inspection[]> {
    let params = new HttpParams();

    if (inspetorId) {
      params = params.set('inspetorId', String(inspetorId));
    }

    if (otype?.trim()) {
      params = params.set('otype', otype.trim());
    }

    return this.http.get<Inspection[]>(`${this.inspectionsApiUrl}/por-otype`, { params });
  }

  uploadExcel(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.inspectionsApiUrl}/import`, formData);
  }

  updateInspection(inspection: Inspection): Observable<Inspection> {
    return this.http.put<Inspection>(`${this.inspectionsApiUrl}/${inspection.id}`, inspection);
  }

  deleteInspection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.inspectionsApiUrl}/${id}`);
  }

  assignInspector(inspectionId: number, inspetorId: number): Observable<Inspection> {
    return this.http.put<Inspection>(`${this.inspectionsApiUrl}/${inspectionId}/inspetor/${inspetorId}`, {});
  }

  listInspectors(): Observable<Inspector[]> {
    return this.inspectorRequestWithFallback((url) => this.http.get<Inspector[]>(url));
  }

  createInspector(inspector: Inspector): Observable<Inspector> {
    return this.inspectorRequestWithFallback((url) => this.http.post<Inspector>(url, inspector));
  }

  updateInspector(inspector: Inspector): Observable<Inspector> {
    return this.inspectorRequestWithFallback((url) => this.http.put<Inspector>(`${url}/${inspector.id}`, inspector));
  }

  deleteInspector(id: number): Observable<void> {
    return this.inspectorRequestWithFallback((url) => this.http.delete<void>(`${url}/${id}`));
  }

  listPhotosInspections(): Observable<PhotoInspection[]> {
    return this.http.get<PhotoInspection[]>(this.photosInspectionsApiUrl);
  }

  listPhotosByInspections(inspections: Inspection[]): Observable<PhotoInspection[]> {
    return this.http.post<PhotoInspection[]>(`${this.photosInspectionsApiUrl}/by-inspections`, inspections);
  }

  updatePhotoInspection(id: number, photoFile: File, descricao?: string): Observable<PhotoInspection> {
    const formData = new FormData();
    formData.append('foto', photoFile);

    if (descricao !== undefined && descricao !== null) {
      formData.append('descricao', descricao);
    }

    return this.http.put<PhotoInspection>(`${this.photosInspectionsApiUrl}/${id}`, formData);
  }

  updatePhotoInspectionMetadata(photo: PhotoInspection): Observable<PhotoInspection> {
    return this.http.put<PhotoInspection>(`${this.photosInspectionsApiUrl}/${photo.id}`, {
      descricao: photo.descricao ?? null,
      photoUrl: photo.photoUrl ?? null
    });
  }

  deletePhotoInspection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.photosInspectionsApiUrl}/${id}`);
  }

  uploadInspectionZip(file: File): Observable<InspectionZipUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<InspectionZipUploadResponse>(this.photoInspectionsImportApiUrl, formData);
  }

  private inspectorRequestWithFallback<T>(request: (baseUrl: string) => Observable<T>): Observable<T> {
    return request(this.inspectorsApiUrl).pipe(
      catchError((error) => {
        if (![403, 404, 405].includes(error?.status)) {
          return throwError(() => error);
        }

        return request(this.inspectorsApiUrlFallback);
      })
    );
  }
}
