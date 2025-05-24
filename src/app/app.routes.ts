import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { LeadListComponent } from './components/lead/lead-list/lead-list.component';
import { LeadCreateComponent } from './components/lead/lead-create/lead-create.component';
import { LeadReadComponent } from './components/lead/lead-read/lead-read.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: "leads",
    component: LeadListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: "leads/create",
    component: LeadCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: "read",
    component: LeadReadComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  }
];
