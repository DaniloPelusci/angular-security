import {tipoDocumento} from './tipoDocumento.model';

export interface DocumentoLead {
  id: number;
  nomeArquivo: string;
  tipoArquivo: string;
  dataUpload: string;
  tipoDocumento: tipoDocumento;
  dataEmissao: string;
}
