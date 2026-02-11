import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inspection } from '../../models/inspection.model';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private readonly apiUrl = 'http://localhost:8080/api/inspections';

  constructor(private http: HttpClient) {}

  list(): Observable<Inspection[]> {
    return this.http.get<Inspection[]>(this.apiUrl);
  }

  uploadExcel(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<void>(`${this.apiUrl}/import`, formData);
  }
}
