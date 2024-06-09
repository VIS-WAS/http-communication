import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { map } from 'rxjs';

export const canActivate = (
  router: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);

  return authService.user.pipe(
    map((user) => {
      return user ? true : false;
    })
  );
};
