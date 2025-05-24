import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { LeadService } from '../lead.service';
import { Lead } from '../../../models/lead.model';

@Component({
  standalone: true, 
  selector: 'app-lead-list',
  imports: [CommonModule, HttpClientModule], 
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css']
})
export class LeadListComponent {
  leads: Lead[] = [];

  constructor(private leadServe: LeadService) {}

  ngOnInit(): void {
    console.log('pokemon');
    this.leadServe.read().subscribe(leads => {
      this.leads = leads;
      console.log(leads);
    });
  }
}
