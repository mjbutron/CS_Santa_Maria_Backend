import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as globalsConstants from 'src/app/common/globals';
import { formatDate } from '@angular/common';
import { Globals } from 'src/app/common/globals';
// Services
import { AuthService } from 'src/app/services/auth.service';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { UserInterface } from 'src/app/models/user-interface';
import { TimeWithoutSecPipe } from 'src/app/pipes/time-without-sec.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Path image
  assetsImg = environment.pathImage;
  // User
  user: UserInterface;
  rememberUser = false;
  // Globals
  globals: Globals;
  // Today date
  todayDate = new Date();
  todayDateStr = '';
  // Tomorrow date
  tomorrowDate = new Date();
  tomorrowDateStr = '';
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param auth         Authentication service
   * @param router       Router object
   * @param globals      Globals
   * @param dataApi      Data API object
   * @param coreService  Core service object
   * @param pipe         Pipe time without seconds
   */
  constructor(private auth: AuthService, private router: Router, globals: Globals,
    private dataApi: DataApiService, private coreService: CoreService,
    private pipe: TimeWithoutSecPipe) {
    this.globals = globals;
    this.tomorrowDate.setDate(this.todayDate.getDate() + 1);
    this.todayDateStr = formatDate(this.todayDate, globalsConstants.K_FORMAT_DATE, globalsConstants.K_LOCALE_EN);
    this.tomorrowDateStr = formatDate(this.tomorrowDate, globalsConstants.K_FORMAT_DATE, globalsConstants.K_LOCALE_EN);
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.user = new UserInterface();
    if (localStorage.getItem(globalsConstants.K_LOGIN_STRG_RMB_EMAIL)) {
      this.user.email = localStorage.getItem(globalsConstants.K_LOGIN_STRG_RMB_EMAIL);
      this.rememberUser = true;
    }
  }

  /**
   * User login
   * @param  form  Form with login information
   */
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: globalsConstants.K_LOGIN_WAIT_ALERT
    });
    Swal.showLoading();

    this.auth.login(this.user).subscribe(data => {
      if (!data.error && globalsConstants.K_COD_OK == data.cod) {
        this.checkStatusAndNotifications();
        Swal.close();
        localStorage.setItem(globalsConstants.K_LOGIN_STRG_USER_NAME, data.user.name);
        localStorage.setItem(globalsConstants.K_LOGIN_STRG_ROL_NAME, data.user.rol_name);
        localStorage.setItem(globalsConstants.K_LOGIN_STRG_USER_IMAGE, data.user.image);
        localStorage.setItem(globalsConstants.K_LOGIN_STRG_EMAIL, this.user.email);
        if (this.rememberUser) {
          localStorage.setItem(globalsConstants.K_LOGIN_STRG_RMB_EMAIL, this.user.email);
        } else {
          localStorage.removeItem(globalsConstants.K_LOGIN_STRG_RMB_EMAIL);
        }
        localStorage.setItem(globalsConstants.K_LOGIN_STRG_EMAIL, this.user.email);
        this.globals.isAuth = true;
        this.globals.userID = data.user.id;
        this.globals.isChangePass = (data.user.change_pass == 0) ? false : true;
        this.router.navigateByUrl('/admin/dashboard');
      }
      else {
        this.globals.isAuth = false;
        this.globals.isChangePass = false;
        if (globalsConstants.K_COD_UNVLBL_SERVICE == data.cod) {
          Swal.fire({
            icon: 'error',
            title: globalsConstants.K_LOGIN_ERROR,
            text: data.message
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: data.message
          });
        }
      }
    });
  }

  /**
   * Check status and notifications
   */
  checkStatusAndNotifications(): void {
    this.getAllWorkshops();
    this.getAllCourses();
  }

  /**
   * Checking notifications about workshops
   */
  getAllWorkshops(): void {
    let notif = "";
    this.dataApi.getAllWorkshops().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (0 < data.allWorkshops.length) {
          for (let wspDate of data.allWorkshops) {
            if (this.todayDateStr == wspDate.session_date) {
              notif = "¡Hoy taller de <b>" + wspDate.title + "</b> a las " + this.pipe.transform(wspDate.session_start) + "!";
            }
            else if (this.tomorrowDateStr == wspDate.session_date) {
              notif = "Taller de <b>" + wspDate.title + "</b> mañana a las " + this.pipe.transform(wspDate.session_start);
            }
            // Check if notification
            if ("" != notif) {
              this.coreService.commandNotification(notif, globalsConstants.K_OWN_USER).subscribe(data => {
                if (globalsConstants.K_COD_OK == data.cod) {
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

  /**
   * Checking notifications about courses
   */
  getAllCourses(): void {
    let notif = "";
    this.dataApi.getAllCourses().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (0 < data.allCourses.length) {
          for (let crsDate of data.allCourses) {
            if (this.todayDateStr == crsDate.session_date) {
              notif = "¡Hoy curso de <b>" + crsDate.title + "</b> a las " + this.pipe.transform(crsDate.session_start) + "!";
            }
            else if (this.tomorrowDateStr == crsDate.session_date) {
              notif = "Curso de <b>" + crsDate.title + "</b> mañana a las " + this.pipe.transform(crsDate.session_start);
            }
            // Check if notification
            if ("" != notif) {
              this.coreService.commandNotification(notif, globalsConstants.K_OWN_USER).subscribe(data => {
                if (globalsConstants.K_COD_OK == data.cod) {
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
