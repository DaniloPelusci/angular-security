import {Component, Input, Output, EventEmitter, numberAttribute, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LeadService } from '../lead.service';
import { Endereco } from '../../../models/endereco.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-lead-endereco-form',
  templateUrl: './lead-endereco-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,      // <-- ADICIONE AQUI!
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule
  ]
})
export class LeadEnderecoFormComponent {
  @Input({ transform: numberAttribute }) leadId!: number;
  @Input() endereco?: Endereco | null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() enderecoSalvo = new EventEmitter<void>();
  @Input() enderecoParaEditar?: Endereco;
  form: FormGroup;

  constructor(private fb: FormBuilder, private leadService: LeadService) {
    this.form = this.fb.group({
      id: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
      principal: [false] // <-- Adicione este campo!
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['enderecoParaEditar']) {
      if (this.enderecoParaEditar) {
        this.form.patchValue(this.enderecoParaEditar);
      } else {
        this.form.reset();
      }
    }
  }


  onSubmit() {
    const endereco: Endereco = {
      ...this.form.value,
      lead: { id: this.leadId }
    };
    if (this.endereco && this.endereco.id) {
      // EDITAR
      endereco.id = this.endereco.id;
      this.leadService.updateEndereco(endereco).subscribe(() => {
        this.enderecoSalvo.emit();
        this.form.reset();
      });
    } else {
      // CRIAR
      this.leadService.adicionarEndereco(endereco).subscribe(() => {
        this.enderecoSalvo.emit();
        this.form.reset();
      });
    }
  }


}
