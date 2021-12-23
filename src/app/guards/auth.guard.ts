import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
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
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      this.globals.isAuth = true;
      return true;
    } else {
      this.globals.isAuth = false;
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
