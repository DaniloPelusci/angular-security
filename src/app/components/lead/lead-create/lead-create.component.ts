import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { LeadService } from '../lead.service';
import { Lead } from '../../../models/lead.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lead-create',
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatCardModule,MatIconModule]
})
export class LeadCreateComponent implements OnChanges {
  @Input() leadToEdit?: Lead;
  @Output() saved = new EventEmitter<void>();

  leadForm: FormGroup;

  constructor(private fb: FormBuilder, private leadService: LeadService) {
    this.leadForm = this.fb.group({
      id: [],
      nome: ['', Validators.required],
      cpfCnpj: [''],
      telefone: [''],
      origem: [''],
      statusLeads: [''],
      observacao: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['leadToEdit'] && this.leadToEdit) {
      this.leadForm.patchValue(this.leadToEdit);
    } else {
      this.leadForm.reset();
    }
  }

  onSubmit() {
    const lead: Lead = this.leadForm.value;
    if (lead.id) {
      this.leadService.update(lead).subscribe(() => this.saved.emit());
    } else {
      this.leadService.create(lead).subscribe(() => this.saved.emit());
    }
    this.leadForm.reset();
  }

  clearForm() {
    this.leadForm.reset();
  }
}
