import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { Globals } from 'src/app/common/globals';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  globals: Globals;

  constructor(private auth: AuthService, private router: Router, globals: Globals) {
    this.globals = globals;
  }

  canActivate(): boolean {
    if(this.auth.isAuthenticated()){
      this.globals.isAuth = true;
      return true;
    }else{
      this.globals.isAuth = false;
      this.router.navigateByUrl('login');
      return false;
    }
  }

}
