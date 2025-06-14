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

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  baseUrl = "http://localhost:8080/leads";
  private apiUrl = "http://localhost:8080/api/leads";
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

  create(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl, lead);
  }

  update(lead: Lead): Observable<Lead> {
    return this.http.put<Lead>(`${this.apiUrl}/${lead.id}`, lead);
  }
  listCorretores(): Observable<{ id: number, nome: string }[]> {
    return this.http.get<{ id: number, nome: string }[]>('http://localhost:8080/api/users/corretores');
  }

}
