import { Component, OnInit } from '@angular/core';
import { LeadService } from '../lead.service';
import { Lead} from '../../../models/lead.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  imports: [CommonModule],
  standalone: true
})
export class LeadListComponent implements OnInit {
  leads: Lead[] = [];
  selectedLead?: Lead;

  constructor(private leadService: LeadService) {}

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.leadService.read().subscribe({
      next: (leads) => this.leads = leads,
      error: (err) => console.error('Erro ao buscar leads:', err)
    });
  }

  onEditLead(lead: Lead) {
    this.selectedLead = { ...lead };
  }

  onSaved() {
    this.selectedLead = undefined;
    this.loadLeads();
  }
  
}
