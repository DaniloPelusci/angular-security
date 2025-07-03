import {PermissionModel} from '../Permission.model';

export interface UserCadastroDTO {
  userName: string;
  nome: string;
  email: string;
  telefone: string;
  password: string;
  permissions: PermissionModel[];
}
