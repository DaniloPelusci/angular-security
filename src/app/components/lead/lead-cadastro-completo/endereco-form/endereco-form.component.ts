import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {Endereco} from '../../../../models/endereco.model';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-endereco-form',
  templateUrl: './endereco-form.component.html',
  styleUrls: ['./endereco-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckbox,
    MatCard
  ]
})
export class EnderecoFormComponent implements OnInit {
  @Output() submitEndereco = new EventEmitter<any>();
  @Output() enderecoChange = new EventEmitter<Endereco>();
  @Input() endereco?: any; // Pode tipar como Endereco se tiver o model

  enderecoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.enderecoForm = this.fb.group({
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', [Validators.required, Validators.maxLength(2)]],
      cep: ['', Validators.required],
      principal: [false]
    });
  }

  ngOnInit() {
    // Se vier um endereço para editar, preenche o form
    if (this.endereco) {
      this.enderecoForm.patchValue(this.endereco);
    }
    this.enderecoForm.valueChanges.subscribe(value => {
      this.enderecoChange.emit(value);
    });
  }

  onSubmit() {
    if (this.enderecoForm.valid) {
      this.submitEndereco.emit(this.enderecoForm.value);
    }
  }
}
