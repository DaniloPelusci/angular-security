import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { LeadCreateComponent } from './lead-create/lead-create.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Lead } from '../../models/lead.model';
import { Observable } from 'rxjs';
import {DocumentoLead} from '../../models/documentoLead.model';
import {Endereco} from '../../models/endereco.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  baseUrl = "http://localhost:8080/leads";
  private apiUrl = "http://localhost:8080/api/leads";
  private apiCorresp = "http://localhost:8080/api/correspondente/leads/completos";
  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showOnConsole(msg: string): void{
    this.snackBar.open(msg , '',{
      duration:3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })

  }

  read(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl);
  }
  listCorrespondent(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiCorresp);
  }

  create(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, lead);
  }

  update(lead: Lead): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${lead.id}`, lead);
  }
  listCorretores(): Observable<{ id: number, nome: string }[]> {
    return this.http.get<{ id: number, nome: string }[]>('http://localhost:8080/api/users/corretores');
  }

  uploadDocumentos(formData: FormData) {
    return this.http.post('http://localhost:8080/api/documentos-lead/upload', formData)
  }
  getDocumentosDoLead(leadId: number) {
    return this.http.get<DocumentoLead[]>(`http://localhost:8080/api/documentos-lead/lead/${leadId}`);
  }

  downloadDocumento(id: number) {
    return this.http.get(`http://localhost:8080/api/documentos-lead/${id}/download`, { responseType: 'blob' });
  }

  deletarDocumento(documentoId: number) {
    return this.http.delete(`http://localhost:8080/api/documentos-lead/${documentoId}`);
  }
  listarEnderecosDoLead(leadId?: number): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`/api/enderecos-lead/lead/${leadId}`);
  }
  adicionarEndereco(leadId: number, endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(`/api/enderecos-lead/lead/${leadId}`, endereco);
  }


}
