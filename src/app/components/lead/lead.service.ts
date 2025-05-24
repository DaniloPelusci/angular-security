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
import { HttpClient } from '@angular/common/http';
import { Lead } from '../../models/lead.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  baseUrl = "http://localhost:8080/leads";

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showOnConsole(msg: string): void{
    this.snackBar.open(msg , '',{
      duration:3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
    
  }
  create(lead: Lead): Observable<Lead>{
    return this.http.post(this.baseUrl, lead)
  }
  read(): Observable<Lead[]>{
    return this.http.get<Lead[]>(this.baseUrl)
  }
  
}
