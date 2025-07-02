import { Component, EventEmitter, Output } from '@angular/core';
import {CommonModule, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-documento-form',
  templateUrl: './documento-form.component.html',
  styleUrls: ['./documento-form.component.scss'],
  imports: [
    NgIf,
    NgForOf,
    MatIcon,
    DatePipe,
    CommonModule,
    MatCard
  ],
  // ...
})
export class DocumentoFormComponent {
  arquivosParaUpload: File[] = [];
  documentos: any[] = []; // troque para seu tipo de documento

  // Chame esta função no (change) do input file
  @Output() documentoChange = new EventEmitter<any[]>();
  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.arquivosParaUpload = Array.from(target.files);
    }
  }

  enviarArquivos() {
    // lógica de upload
    // depois de enviar, limpe arquivosParaUpload e recarregue documentos do backend
    this.arquivosParaUpload = [];
  }

  baixarDocumento(id: number, nomeArquivo: string) {
    // lógica para baixar
  }

  deletarDocumento(id: number) {
    // lógica para deletar
  }

  isDataVencida(dataEmissao: string | Date): boolean {
    if (!dataEmissao) return false;
    const data = new Date(dataEmissao);
    const agora = new Date();
    // Exemplo: considera vencido se for há mais de 3 meses
    const limite = new Date(agora.getFullYear(), agora.getMonth() - 3, agora.getDate());
    return data < limite;
  }
}
