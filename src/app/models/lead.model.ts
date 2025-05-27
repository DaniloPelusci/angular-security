import { OrigemEnum } from "../enums/origem";
import { StatusEnum } from "../enums/status";
import { Usuario} from "./usuario.model";

// src/app/models/lead.model.ts
export interface Lead {
  id?: number;
  nome?: string;
  cpfCnpj?: string;
  telefone?: string;
  origem?: string;
  statusLeads?: string;
  observacao?: string;
  corretor?: Usuario;   // <-- Tem que ser igual ao campo que vem no JSON!
}

