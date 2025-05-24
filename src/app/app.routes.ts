import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // <-- Esta linha garante o redirecionamento inicial
  { path: 'login', component: LoginComponent },
  {
    path: 'dash',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
];
