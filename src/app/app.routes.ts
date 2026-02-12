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
import {LeadCadastroCompletoComponent} from './components/lead/lead-cadastro-completo/lead-cadastro-completo.component';
import {RegisterComponent} from './auth/register/register.component';
import {UserListComponent} from './components/user/user-list/user-list.component';
import {SolicitarDocumentoComponent} from './components/lead/solicitar-documento/solicitar-documento.component';
import {
  InspectionImportListComponent
} from './components/inspection/inspection-import-list/inspection-import-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
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
  },
  {
    path: 'lead/completo',
    component: LeadCadastroCompletoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', "ROLE_CORRESPONDENTE"] }
  },
  {
    path: 'leads/documento',
    component: SolicitarDocumentoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] }
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },
  {
    path: 'inspections',
    component: InspectionImportListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN', 'ROLE_CORRETOR'] }
  }
];
