import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as globalsConstants from 'src/app/common/globals';
import { formatDate } from '@angular/common';

import { Globals } from 'src/app/common/globals';

import { AuthService } from 'src/app/services/auth.service';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { UserInterface } from 'src/app/models/user-interface';
import { TimeWithoutSecPipe } from 'src/app/pipes/time-without-sec.pipe';

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
  // Today date
  todayDate = new Date();
  todayDateStr = '';
  // Tomorrow date
  tomorrowDate = new Date();
  tomorrowDateStr = '';

  constructor(private auth: AuthService, private router: Router, globals: Globals,
    private dataApi: DataApiService, private coreService: CoreService,
    private pipe: TimeWithoutSecPipe) {
    this.globals = globals;
    this.tomorrowDate.setDate(this.todayDate.getDate() + 1);
    this.todayDateStr = formatDate(this.todayDate, globalsConstants.K_FORMAT_DATE,globalsConstants.K_LOCALE_EN);
    this.tomorrowDateStr = formatDate(this.tomorrowDate, globalsConstants.K_FORMAT_DATE,globalsConstants.K_LOCALE_EN);
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
        this.checkStatusAndNotifications();
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

  checkStatusAndNotifications(){
    this.getAllWorkshops();
    this.getAllCourses();
  }

  getAllWorkshops(){
    let notif = "";
    this.dataApi.getAllWorkshops().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod){
        if(0 < data.allWorkshops.length){
          for(let wspDate of data.allWorkshops){
            if(this.todayDateStr == wspDate.session_date){
              notif = "¡Hoy taller de " + wspDate.title + " a las " + this.pipe.transform(wspDate.session_start) + "!";
            }
            else if(this.tomorrowDateStr == wspDate.session_date){
              notif = "Taller de " + wspDate.title + " mañana a las " + this.pipe.transform(wspDate.session_start);
            }
            // Check if notification
            if("" != notif){
              this.coreService.commandNotification(notif, globalsConstants.K_OWN_USER).subscribe(data => {
                if (globalsConstants.K_COD_OK == data.cod){
                  // Do nothing
                } else{
                  // Do nothing
                }
              });
            }
            notif = "";
          }
        }
      }
    });
  }

  getAllCourses(){
    let notif = "";
    this.dataApi.getAllCourses().subscribe((data) => {
        if (globalsConstants.K_COD_OK == data.cod){
          if(0 < data.allCourses.length){
            for(let crsDate of data.allCourses){
              if(this.todayDateStr == crsDate.session_date){
                notif = "¡Hoy curso de " + crsDate.title + " a las " + this.pipe.transform(crsDate.session_start) + "!";
              }
              else if(this.tomorrowDateStr == crsDate.session_date){
                notif = "Curso de " + crsDate.title + " mañana a las " + this.pipe.transform(crsDate.session_start);
              }
              // Check if notification
              if("" != notif){
                this.coreService.commandNotification(notif, globalsConstants.K_OWN_USER).subscribe(data => {
                  if (globalsConstants.K_COD_OK == data.cod){
                    // Do nothing
                  } else{
                    // Do nothing
                  }
                });
              }
              notif = "";
            }
          }
        }
    });
  }

}
