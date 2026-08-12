import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authServ = inject(Auth);
  const router = inject(Router);

  if (authServ.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
