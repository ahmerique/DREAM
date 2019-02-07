import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services';
import { map, first } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('currentUser')) {
      return this.authenticationService.checkToken().pipe(
        map((res) => {
          if (res.status === 'success') {
            return true;
          } else {
            localStorage.removeItem('currentUser');
            this.router.navigate(['/guest']);
            return false;
          }
        }));
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/guest'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
