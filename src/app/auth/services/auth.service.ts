import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { PermissionModel } from '../../models/Permission.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly authApiUrl = `${this.apiBaseUrl}/auth`;
  private readonly usersApiUrl = `${this.apiBaseUrl}/api/users`;
  private readonly permissionsApiUrl = `${this.apiBaseUrl}/api/permissions`;

  private jwtSubject = new BehaviorSubject<string | null>(this.getToken());
  jwt$ = this.jwtSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }) {
    return this.http
      .post<{ token: string }>(`${this.authApiUrl}/login`, credentials)
      .pipe(
        tap((res) => {
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
    username: string;
    nome: string;
    email: string;
    telefone: string;
    password: string;
    permissions: PermissionModel[];
  }) {
    return this.http.post(this.usersApiUrl, user);
  }

  getPermissions() {
    return this.http.get<PermissionModel[]>(this.permissionsApiUrl);
  }

  private setToken(token: string) {
    try {
      localStorage.setItem('jwt', token);
    } catch {}
  }

  getToken(): string | null {
    try {
      return localStorage.getItem('jwt');
    } catch {
      return null;
    }
  }

  private removeToken() {
    try {
      localStorage.removeItem('jwt');
    } catch {}
  }

  get token() {
    return this.getToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasAnyRole(roles: string[]): boolean {
    const token = this.token;
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRoles: string[] = payload.roles || payload.authorities || [];
      return roles.some((role) => userRoles.includes(role));
    } catch {
      return false;
    }
  }

  getRoles(): string[] {
    const token = localStorage.getItem('jwt');
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
