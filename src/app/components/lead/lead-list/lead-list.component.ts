import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LeadService } from '../lead.service';
import { Lead } from '../../../models/lead.model';

@Component({
  standalone: true,
  selector: 'app-lead-list',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css']
})
export class LeadListComponent implements OnInit {
  leads: Lead[] = [];

  constructor(private leadServe: LeadService) {}

  ngOnInit(): void {
    this.leadServe.read().subscribe({
      next: (leads) => {
        this.leads = leads;
        console.log(leads);
      },
      error: (err) => {
        console.error('Erro ao buscar leads:', err);
      }
    });
  }
}
