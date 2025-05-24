import { OrigemEnum } from "../enums/origem";
import { StatusEnum } from "../enums/status";
import { Usuario } from "./usuario.model";

export interface Lead {
    id?: string;
    nome?: string;
    telefone?: string;
   // enum
    origem?: OrigemEnum;
    statusLeads?: StatusEnum;
    // relacionamento
    usuario?: Usuario;
}
