import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { LeadCreateComponent } from './components/lead/lead-create/lead-create.component';
import { LeadReadComponent } from './components/lead/lead-read/lead-read.component';
import {
  LeadReadCorrespondenteComponent
} from './components/lead/leads-Habilitados/lead-list-correspondente/lead-read-correspondente.component';
import {LeadEnderecoComponent} from './components/lead/endereco/lead-endereco/lead-endereco.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] }
  },
  {
    path: "leads/create",
    component: LeadCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] }
  },
  {
    path: "read",
    component: LeadReadComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] }
  },
  {
    path: 'listCorrespondente',
    component: LeadReadCorrespondenteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', "ROLE_CORRESPONDENTE"] }
  },
  {
    path: 'endreco',
    component: LeadEnderecoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', "ROLE_CORRESPONDENTE"] }
  }
];
