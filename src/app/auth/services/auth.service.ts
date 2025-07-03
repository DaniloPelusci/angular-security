import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import {PermissionModel} from '../../models/Permission.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtSubject = new BehaviorSubject<string | null>(this.getToken());
  jwt$ = this.jwtSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string }>(
      'http://localhost:8080/auth/login',
      credentials
    ).pipe(
      tap(res => {
        this.setToken(res.token);
        this.jwtSubject.next(res.token);
      })
    );
  }

  logout() {
    this.removeToken();
    this.jwtSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(user: {
    userName: string;
    nome: string;
    email: string;
    telefone: string;
    password: string;
    permissions: PermissionModel[]
  }) {
    return this.http.post(
      'http://localhost:8080/api/users',
      user
    );
  }
  getPermissions() {
    return this.http.get<PermissionModel[]>(
      'http://localhost:8080/api/permissions'
    );
  }

  // Protege acesso ao localStorage com try/catch
  private setToken(token: string) {
    try { localStorage.setItem('jwt', token); } catch {}
  }
  getToken(): string | null {
    try { return localStorage.getItem('jwt'); } catch { return null; }
  }
  private removeToken() {
    try { localStorage.removeItem('jwt'); } catch {}
  }

  get token() {
    return this.getToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Método para verificar se possui pelo menos uma das roles
  hasAnyRole(roles: string[]): boolean {
    const token = this.token;
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRoles: string[] = payload.roles || payload.authorities || [];
      return roles.some(role => userRoles.includes(role));
    } catch {
      return false;
    }
  }

  getRoles(): string[] {
    const token = localStorage.getItem('jwt'); // <-- troque de 'token' para 'jwt'
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles || [];
    } catch {
      return [];
    }
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }


}
