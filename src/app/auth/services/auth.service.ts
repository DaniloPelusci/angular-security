import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/auth/login'; // ajuste para sua API

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.api, credentials);
  }

  getToken() {
    // Simula ausência de autenticação
    return null;
  }

  isAuthenticated() {
    // Sempre retorna false (não autenticado)
    return false;
  }

  logout() {
    // Não faz nada
  }
}
