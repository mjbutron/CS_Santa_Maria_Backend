import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import * as globalsConstants from 'src/app/common/globals';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, catchError, retry, retryWhen, shareReplay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Globals } from 'src/app/common/globals';

const DEFAULT_MAX_RETRIES = 5;
const K_URL_IS_CHANGE_PASS = '/admin/api/isChangePass';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  globals: Globals;

  isSidebarPinned = false;
  isSidebarToggeled = false;

  url = environment.urlApiRest;
  pathServerImg = environment.pathServerImage;

  userEmail = {
    email: ""
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

    // Get if password has been changed (used in reload)
    this.getIsChangePass(localStorage.getItem('email'));

    // Posible método para comprobar notificaciones cada cierto tiempo.
    // setInterval (() => {
    //      this.testSchedule();
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

  getIsChangePass(email: string){
    if(null != email){
      this.changePassService(email).subscribe(data => {
        if (globalsConstants.K_COD_OK == data.cod){
          this.globals.isChangePass = (data.isChangePass.change_pass == 0) ? false : true;
        } else{
          this.globals.isChangePass = true;
        }
      });
    }
  }

  changePassService(email: string){
    this.userEmail.email = email;
    const url_api = this.url + K_URL_IS_CHANGE_PASS;
    return this.http.post(url_api, JSON.stringify(this.userEmail), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        return of( err.value.error );
      }),
      shareReplay()
    )
  }

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

  uploadFiles(image: File){
    const url_api = this.url + '/admin/api/upload';
    var uploadData = new FormData();
    uploadData.append('image', image);
    uploadData.append('path', this.pathServerImg);
    return this.http.post(url_api, uploadData, this.getUploadHeadersOptions());
  }

  testSchedule(){
    console.log("*** Test Schedule ***");
    this.toastr.info('1 Nueva notificación', 'Notificaciones');
  }

}
