import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lead } from '../../models/lead.model';
import { DocumentoLead } from '../../models/documentoLead.model';
import { Endereco } from '../../models/endereco.model';
import { LeadCadastroCompletoDTO } from '../../models/dto/leadCadastroCompletoDTO';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly leadsApiUrl = `${this.apiBaseUrl}/api/leads`;
  private readonly correspondentesApiUrl = `${this.apiBaseUrl}/api/correspondente/leads/completos`;
  private readonly usersApiUrl = `${this.apiBaseUrl}/api/users`;
  private readonly documentosLeadApiUrl = `${this.apiBaseUrl}/api/documentos-lead`;
  private readonly enderecosLeadApiUrl = `${this.apiBaseUrl}/api/enderecos-lead`;

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  showOnConsole(msg: string): void {
    this.snackBar.open(msg, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  read(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.leadsApiUrl);
  }

  listCorrespondent(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.correspondentesApiUrl);
  }

  create(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(this.leadsApiUrl, lead);
  }

  update(lead: Lead): Observable<Lead> {
    return this.http.put<Lead>(`${this.leadsApiUrl}/${lead.id}`, lead);
  }

  listCorretores(): Observable<{ id: number; nome: string }[]> {
    return this.http.get<{ id: number; nome: string }[]>(`${this.usersApiUrl}/corretores`);
  }

  uploadDocumentos(formData: FormData) {
    return this.http.post(`${this.documentosLeadApiUrl}/upload`, formData);
  }

  getDocumentosDoLead(leadId: number) {
    return this.http.get<DocumentoLead[]>(`${this.documentosLeadApiUrl}/lead/${leadId}`);
  }

  downloadDocumento(id: number) {
    return this.http.get(`${this.documentosLeadApiUrl}/${id}/download`, { responseType: 'blob' });
  }

  deletarDocumento(documentoId: number) {
    return this.http.delete(`${this.documentosLeadApiUrl}/${documentoId}`);
  }

  listarEnderecosDoLead(leadId?: number): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`${this.enderecosLeadApiUrl}/lead/${leadId}`);
  }

  adicionarEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(this.enderecosLeadApiUrl, endereco);
  }

  updateEndereco(endereco: Endereco) {
    return this.http.put<Endereco>(this.enderecosLeadApiUrl, endereco);
  }

  deleteEndereco(enderecoId: number) {
    return this.http.delete(`${this.enderecosLeadApiUrl}/${enderecoId}`);
  }

  definirEnderecoPrincipal(leadId: number, enderecoId: number) {
    return this.http.put(`${this.enderecosLeadApiUrl}/${leadId}/definir-principal/${enderecoId}`, null);
  }

  cadastrarCompleto(dto: LeadCadastroCompletoDTO) {
    return this.http.post(`${this.leadsApiUrl}/cadastro-completo`, dto);
  }

  solicitarDocumentos(leadId: number) {
    return this.http.post<{ link: string }>(`${this.leadsApiUrl}/${leadId}/solicitar-documentos`, {});
  }
}
