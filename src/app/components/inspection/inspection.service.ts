import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inspection } from '../../models/inspection.model';
import { Inspector } from '../../models/inspector.model';
import { PhotoInspection } from '../../models/photo-inspection.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private readonly inspectionsApiUrl = `${environment.apiBaseUrl}/api/inspections`;
  private readonly inspectorsApiUrl = `${environment.apiBaseUrl}/api/inspetores`;
  private readonly photosInspectionsApiUrl = `${environment.apiBaseUrl}/api/fotosinspections`;

  constructor(private http: HttpClient) {}

  listInspections(): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(this.inspectionsApiUrl);
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
    return this.http.get<Inspector[]>(this.inspectorsApiUrl);
  }

  createInspector(inspector: Inspector): Observable<Inspector> {
    return this.http.post<Inspector>(this.inspectorsApiUrl, inspector);
  }

  updateInspector(inspector: Inspector): Observable<Inspector> {
    return this.http.put<Inspector>(`${this.inspectorsApiUrl}/${inspector.id}`, inspector);
  }

  deleteInspector(id: number): Observable<void> {
    return this.http.delete<void>(`${this.inspectorsApiUrl}/${id}`);
  }

  listPhotosInspections(): Observable<PhotoInspection[]> {
    return this.http.get<PhotoInspection[]>(this.photosInspectionsApiUrl);
  }
}
