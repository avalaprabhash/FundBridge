import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';
import { UserRole } from '../models';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      return router.createUrlTree(['/login']);
    }

    if (allowedRoles.includes(auth.userRole())) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
};
