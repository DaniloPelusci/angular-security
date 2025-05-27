export interface Usuario {
  id?: number;
  username?: string;
  password?: string;
  nome?: string;
  telefone?: string;
  email?: string;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  enabled?: boolean;
  authorities?: { authority: string }[];
}
