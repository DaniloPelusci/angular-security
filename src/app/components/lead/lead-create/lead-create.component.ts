import { Component } from '@angular/core';
import { LeadService } from '../lead.service';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // aqui é MatIconModule, não MatIcon
import { HttpClient, HttpClientModule } from '@angular/common/http'; // IMPORTANTE
import { RouterModule } from '@angular/router'; // caso use <routerLink> ou Router
import { CommonModule } from '@angular/common'; // para diretivas ngIf, ngFor etc.
import { Lead } from '../../../models/lead.model';
import { Router } from '@angular/router';


@Component({
  standalone: true, 
  selector: 'app-lead-create',
  imports: [
    HttpClientModule ,
    FlexLayoutModule,
    MatCardModule,
    FormsModule, 
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
    ],
  templateUrl: './lead-create.component.html',
  styleUrl: './lead-create.component.css'
})
export class LeadCreateComponent {

  constructor(private leadService: LeadService, private router: Router){}
  lead: Lead = {

  
  
  };
  ngOnInit(): void {
    
  }
  createLead(){
    this.leadService.create(this.lead).subscribe(()=> 
      {this.leadService.showOnConsole('Lead Criado') })
    this.router.navigate(['leads'])
  }

}
