import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import * as globalsConstants from 'src/app/common/globals';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, catchError, retry, retryWhen, shareReplay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Globals } from 'src/app/common/globals';
import { NotificationInterface } from 'src/app/models/notification-interface';

const DEFAULT_MAX_RETRIES = 5;
const K_URL_USER_DATA = '/admin/api/userData';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  globals: Globals;

  isSidebarPinned = false;
  isSidebarToggeled = false;

  url = environment.urlApiRest;
  pathServerImg = environment.pathServerImage;

  userDataLog = {
    user_id: 0,
    email: ""
  };

  notificationData = {
    user_id: 0,
    message: "",
    to: globalsConstants.K_ALL_USERS
  };

  // httpOptions = {
  // headers: new HttpHeaders({
  //   "Content-type": "application/json",
  //   "Authorization": "Bearer "
  //   })
  // };
  //
  // httpOptionsUpload = {
  // headers: new HttpHeaders({
  //   "Authorization": "Bearer "
  //   })
  // };

  constructor(private http: HttpClient, public toastr: ToastrService, globals: Globals) {
    this.globals = globals;
    // Get user data
    this.getUserData(localStorage.getItem('email'));
    // Posible método para comprobar notificaciones cada cierto tiempo.
    // setInterval (() => {
    //      console.log("USER_ID: " + this.globals.userID);
    //   }, 5000);
  }

  getHeadersOptions(){
    return {
    headers: new HttpHeaders({
      "Content-type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem('accessTkn')
      })
    };
  }

  getUploadHeadersOptions(){
    return {
    headers: new HttpHeaders({
      "Authorization": "Bearer " + localStorage.getItem('accessTkn')
      })
    };
  }

  // Delay retry
  delayRetry(delayMs: number, maxRetry = DEFAULT_MAX_RETRIES){
    let retries = maxRetry;

    return (src:Observable<any>) =>
    src.pipe(
      retryWhen((errors: Observable<any>) => errors.pipe(
        delay(delayMs),
        mergeMap(error => retries-- > 0 ? of(error) : throwError(of(error)))
      ))
    );
  }

// USER DATA
  getUserData(email: string){
    if(null != email){
      this.userData(email).subscribe(data => {
        if (globalsConstants.K_COD_OK == data.cod){
          this.globals.userID = data.userData.id;
          this.globals.isChangePass = (data.userData.change_pass == 0) ? false : true;
        } else{
          this.globals.userID = 0;
          this.globals.isChangePass = true;
        }
      });
    }
  }

  userData(email: string){
    this.userDataLog.email = email;
    const url_api = this.url + K_URL_USER_DATA;
    return this.http.post(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }

// SIDEBAR SERVICE
  toggleSidebar() {
    this.isSidebarToggeled = ! this.isSidebarToggeled;
  }

  toggleSidebarPin() {
    this.isSidebarPinned = ! this.isSidebarPinned;
  }

  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled
    }
  }

// UPLOAD FILES SERVICE
  uploadFiles(image: File){
    const url_api = this.url + '/admin/api/upload';
    var uploadData = new FormData();
    uploadData.append('image', image);
    uploadData.append('path', this.pathServerImg);
    return this.http.post(url_api, uploadData, this.getUploadHeadersOptions());
  }

// NOTIFICATION SERVICE
  getNotificationsByPage(page: Number){
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/notificationsByPage/' + page;
    return this.http.post(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }

  findNotifications(){
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/findNotifications';
    return this.http.post(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }

  markAsNotified(){
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/allNotified';
    return this.http.put(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }

  notificationReadNoRead(notification: NotificationInterface){
    const url_api = this.url + '/admin/api/notification/readNoRead/' + notification.id;
    return this.http.put(url_api, JSON.stringify(notification), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }

  deleteAllNotifications() {
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/allDelete';
    return this.http.put(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }

  readAllNotifications() {
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/allRead';
    return this.http.put(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }

  createNotification(mod: string, action: string, name: string, to: string){
    // Create notification
    let userName = localStorage.getItem('username');
    let message = userName + action + mod + "<b>" + name + "</b>";
    this.commandNotification(message, to).subscribe(data => {
      if (globalsConstants.K_COD_OK == data.cod){
        // Ok
      } else{
        // Error
      }
    });
  }

  commandNotification(notification: string, to: string){
    this.notificationData.user_id = this.globals.userID;
    this.notificationData.message = notification;
    this.notificationData.to = to;
    const url_api = this.url + '/admin/api/notification/new';
    return this.http.post(url_api, JSON.stringify(this.notificationData), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }
}
