// src/app/models/endereco.model.ts

import { Lead } from './lead.model';

export interface Endereco {
  id?: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal?: boolean;
  lead?: Lead | { id: number };  // <--- ADICIONADO
}
