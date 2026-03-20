export interface FotoProcessada {
  arquivo: string;
  inspectionId: number;
  substituida: boolean;
}

export interface FotoNaoProcessada {
  arquivo: string;
  motivo: string;
}

export interface InspectionZipUploadResponse {
  totalArquivos: number;
  processadas: number;
  naoProcessadas: number;
  fotosProcessadas: FotoProcessada[];
  fotosNaoProcessadas: FotoNaoProcessada[];
}
