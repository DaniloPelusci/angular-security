import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

function storageAvailable(type: 'localStorage' | 'sessionStorage') {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8080/auth/login'; // ajuste para sua API

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.api, credentials).pipe(
      tap(res => {
        if (storageAvailable('localStorage')) {
          try {
            localStorage.setItem('token', res.token);
          } catch (e) {
            console.error('Erro ao gravar token no localStorage', e);
          }
        } else {
          console.error('localStorage não está disponível!');
        }
      })
    );
  }

  getToken() {
    if (storageAvailable('localStorage')) {
      try {
        return localStorage.getItem('token');
      } catch (e) {
        console.error('Erro ao ler token do localStorage', e);
        return null;
      }
    }
    return null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    if (storageAvailable('localStorage')) {
      try {
        localStorage.removeItem('token');
      } catch (e) {
        console.error('Erro ao remover token do localStorage', e);
      }
    }
  }
}
