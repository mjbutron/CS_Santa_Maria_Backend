import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Globals } from 'src/app/common/globals';

import { AuthService } from 'src/app/services/auth.service';
import { UserInterface } from 'src/app/models/user-interface';

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
      text: 'Por favor, espere...'
    });
    Swal.showLoading();

    this.auth.login(this.user).subscribe(res => {
      Swal.close();
      localStorage.setItem('username', res['user'].name);
      localStorage.setItem('rolname', res['user'].rol_name);
      localStorage.setItem('email', this.user.email);
      if(this.rememberUser){
        localStorage.setItem('rememberEmail', this.user.email);
      }else{
        localStorage.removeItem('rememberEmail');
      }
      localStorage.setItem('email', this.user.email);
      this.globals.isAuth = true;
      this.router.navigateByUrl('/admin/dashboard');
    }, (err) => {
      this.globals.isAuth = false;
      Swal.fire({
        icon: 'error',
        title: '¡Nombre de usuario o contraseña incorrectos!',
        text: err.error.error.message
      });
    });
  }

}
