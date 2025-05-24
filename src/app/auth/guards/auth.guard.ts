import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data['roles'] as string[] | undefined;

  // Se precisa de roles, verifica se usuário tem pelo menos uma delas
  if (roles && !auth.hasAnyRole(roles)) {
    router.navigate(['/login']); // ou para alguma tela de acesso negado
    return false;
  }

  return true;
};
