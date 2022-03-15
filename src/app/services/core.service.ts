import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import * as globalsConstants from 'src/app/common/globals';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, catchError, retry, retryWhen, shareReplay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
// Services
import { NotificationInterface } from 'src/app/models/notification-interface';
// Constants
const DEFAULT_MAX_RETRIES = 5;
const K_URL_USER_DATA = '/admin/api/userData';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  // Globals
  globals: Globals;
  // Sidebar utils
  isSidebarPinned = false;
  isSidebarToggeled = false;
  // URL API
  url = environment.urlApiRest;
  pathServerImg = environment.pathServerImage;
  // User data
  userDataLog = {
    user_id: 0,
    email: ""
  };
  // Notification data
  notificationData = {
    user_id: 0,
    message: "",
    to: globalsConstants.K_ALL_USERS
  };

  /**
   * Constructor
   * @param http     HttpClient module
   * @param toastr   Toastr service
   * @param globals  Globals
   */
  constructor(private http: HttpClient, public toastr: ToastrService, globals: Globals) {
    this.globals = globals;
    this.getUserData(localStorage.getItem(globalsConstants.K_LOGIN_STRG_EMAIL));
  }

  /**
   * Headers options
   * @return Http header object with the given values.
   */
  getHeadersOptions() {
    return {
      headers: new HttpHeaders({
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem(globalsConstants.K_LOGIN_STRG_ACCESSTKN)
      })
    };
  }

  /**
   * Upload headers options
   * @return Http header object with the given values.
   */
  getUploadHeadersOptions() {
    return {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + localStorage.getItem(globalsConstants.K_LOGIN_STRG_ACCESSTKN)
      })
    };
  }

  /**
   * Delay retry
   * @param  delayMs  Delay in milliseconds
   * @param  maxRetry = DEFAULT_MAX_RETRIES Maximum number of retries
   * @return Observable modified with retry logic
   */
  delayRetry(delayMs: number, maxRetry = DEFAULT_MAX_RETRIES) {
    let retries = maxRetry;

    return (src: Observable<any>) =>
      src.pipe(
        retryWhen((errors: Observable<any>) => errors.pipe(
          delay(delayMs),
          mergeMap(error => retries-- > 0 ? of(error) : throwError(of(error)))
        ))
      );
  }

  /**
   * Get user ID and is change password
   * @param email  Email of the logged in user
   */
  getUserData(email: string): void {
    if (null != email) {
      this.userData(email).subscribe(data => {
        if (globalsConstants.K_COD_OK == data.cod) {
          this.globals.userID = data.userData.id;
          this.globals.rol_name = data.userData.rol_name;
          this.globals.isChangePass = (data.userData.change_pass == 0) ? false : true;
        } else {
          this.globals.userID = 0;
          this.globals.isChangePass = true;
        }
      });
    }
  }

  /**
   * Get user data
   * @param  email  Email of the logged in user
   * @return An Observable of the response body as a JSON object
   */
  userData(email: string) {
    this.userDataLog.email = email;
    const url_api = this.url + K_URL_USER_DATA;
    return this.http.post(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
      .pipe(
        this.delayRetry(2000, 3),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Show/hide sidebar
   */
  toggleSidebar(): void {
    this.isSidebarToggeled = !this.isSidebarToggeled;
  }

  /**
   * Anchor the sidebar
   */
  toggleSidebarPin(): void {
    this.isSidebarPinned = !this.isSidebarPinned;
  }

  /**
   * Sidebar status
   * @return Returns the status of the sidebar
   */
  getSidebarStat() {
    return {
      isSidebarPinned: this.isSidebarPinned,
      isSidebarToggeled: this.isSidebarToggeled
    }
  }

  /**
   * Upload files
   * @param  image Image
   * @return An Observable of the response body as a JSON object
   */
  uploadFiles(image: File) {
    const url_api = this.url + '/admin/api/upload';
    var uploadData = new FormData();
    uploadData.append('image', image);
    uploadData.append('path', this.pathServerImg);
    return this.http.post(url_api, uploadData, this.getUploadHeadersOptions());
  }

  /**
   * Obtain notification by page
   * @param  page  Page number to show
   * @return An Observable of the response body as a JSON object
   */
  getNotificationsByPage(page: Number) {
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/notificationsByPage/' + page;
    return this.http.post(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
      .pipe(
        this.delayRetry(2000, 3),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Check notifications
   * @return An Observable of the response body as a JSON object
   */
  findNotifications() {
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/findNotifications';
    return this.http.post(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
      .pipe(
        this.delayRetry(2000, 3),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Allows you to mark notifications as notified
   * @return An Observable of the response body as a JSON object
   */
  markAsNotified() {
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/allNotified';
    return this.http.put(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
      .pipe(
        this.delayRetry(2000, 3),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Mark notifications as read or unread
   * @param  notification Notification to mark
   * @return An Observable of the response body as a JSON object
   */
  notificationReadNoRead(notification: NotificationInterface) {
    const url_api = this.url + '/admin/api/notification/readNoRead/' + notification.id;
    return this.http.put(url_api, JSON.stringify(notification), this.getHeadersOptions())
      .pipe(
        this.delayRetry(2000, 3),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Delete all notifications
   * @return An Observable of the response body as a JSON object
   */
  deleteAllNotifications() {
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/allDelete';
    return this.http.put(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
      .pipe(
        this.delayRetry(2000, 3),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Mark all notifications as read
   * @return An Observable of the response body as a JSON object
   */
  readAllNotifications() {
    this.userDataLog.email = localStorage.getItem('email');
    this.userDataLog.user_id = this.globals.userID;
    const url_api = this.url + '/admin/api/allRead';
    return this.http.put(url_api, JSON.stringify(this.userDataLog), this.getHeadersOptions())
      .pipe(
        this.delayRetry(2000, 3),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Generate notifications
   * @param mod     Modified module
   * @param action  Action performed
   * @param name    Name, title or section modified
   * @param to      Directed to
   */
  createNotification(mod: string, action: string, name: string, to: string): void {
    let userName = localStorage.getItem('username');
    let message = userName + action + mod + "<b>" + name + "</b>";
    this.commandNotification(message, to).subscribe(data => {
      if (globalsConstants.K_COD_OK == data.cod) {
        // Do nothing
      }
    });
  }

  /**
   * Create and save the notification
   * @param  notification String notification
   * @param  to Directed to
   * @return An Observable of the response body as a JSON object
   */
  commandNotification(notification: string, to: string) {
    this.notificationData.user_id = this.globals.userID;
    this.notificationData.message = notification;
    this.notificationData.to = to;
    const url_api = this.url + '/admin/api/notification/new';
    return this.http.post(url_api, JSON.stringify(this.notificationData), this.getHeadersOptions())
      .pipe(
        this.delayRetry(2000, 3),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }
}
