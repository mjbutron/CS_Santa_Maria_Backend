import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as globalsConstants from 'src/app/common/globals';

import { Globals } from 'src/app/common/globals';

import { AuthService } from 'src/app/services/auth.service';
import { UserInterface } from 'src/app/models/user-interface';

// Constants
const K_WAIT_ALERT = 'Por favor, espere...';
const K_LOGIN_ERROR = 'Error en inicio de sesión';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserInterface;
  rememberUser = false;
  globals: Globals;

  constructor(private auth: AuthService, private router: Router, globals: Globals) {
    this.globals = globals;
  }

  ngOnInit() {
    this.user = new UserInterface();
    if(localStorage.getItem('rememberEmail')){
      this.user.email = localStorage.getItem('rememberEmail');
      this.rememberUser = true;
    }
  }

  onLogin(form: NgForm){
    if(form.invalid){
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: K_WAIT_ALERT
    });
    Swal.showLoading();

    this.auth.login(this.user).subscribe(data => {
      if (!data.error && globalsConstants.K_COD_OK == data.cod){
        Swal.close();
        localStorage.setItem('username', data.user.name);
        localStorage.setItem('rolname', data.user.rol_name);
        localStorage.setItem('userImage', data.user.image);
        localStorage.setItem('email', this.user.email);
        if(this.rememberUser){
          localStorage.setItem('rememberEmail', this.user.email);
        }else{
          localStorage.removeItem('rememberEmail');
        }
        localStorage.setItem('email', this.user.email);
        this.globals.isAuth = true;
        this.globals.userID = data.user.id;
        this.globals.isChangePass = (data.user.change_pass == 0) ? false : true;
        this.router.navigateByUrl('/admin/dashboard');
      }
      else {
        this.globals.isAuth = false;
        this.globals.isChangePass = false;
        if(globalsConstants.K_COD_UNVLBL_SERVICE == data.cod){
          Swal.fire({
            icon: 'error',
            title: K_LOGIN_ERROR,
            text: data.message
          });
        }
        else{
          Swal.fire({
            icon: 'error',
            title: data.message
          });
        }
      }
    });
  }
}
