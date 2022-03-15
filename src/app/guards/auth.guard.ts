import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { Globals } from 'src/app/common/globals';
// Services
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // Globals
  globals: Globals;

  /**
   * Constructor
   * @param auth     Authentication service
   * @param router   Router module
   * @param globals  Globals
   */
  constructor(private auth: AuthService, private router: Router, globals: Globals) {
    this.globals = globals;
  }

  /**
   * Allow or deny access to a URL
   * @return True if allowed and False if denied
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.auth.isAuthenticated()) {
      if (this.globals.pathUsers == route.url[1].path && this.globals.rol_name != this.globals.rolAdmin) {
        this.globals.isAuth = true;
        return false;
      }
      else {
        this.globals.isAuth = true;
        return true;
      }
    } else {
      this.globals.isAuth = false;
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
