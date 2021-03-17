import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { Globals } from 'src/app/common/globals';

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

  httpOptions = {
  headers: new HttpHeaders({
    "Content-type": "application/json",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQHNtbWF0cm9uYXMuY29tIn0.cD-C7PiCeQSm8LtpmAkizzG4K4UTSEh88pavRdk8Yso"
    })
  };

  httpOptionsUpload = {
  headers: new HttpHeaders({
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQHNtbWF0cm9uYXMuY29tIn0.cD-C7PiCeQSm8LtpmAkizzG4K4UTSEh88pavRdk8Yso"
    })
  };

  constructor(private http: HttpClient, globals: Globals) {
    this.globals = globals;

    // Get if password has been changed (used in reload)
    this.getIsChangePass(localStorage.getItem('email'));


    // Posible método para comprobar notificaciones cada cierto tiempo.
    // setInterval (() => {
    //      this.testSchedule();
    //   }, 5000);
  }

  getIsChangePass(email: string){
    if(null != email){
      this.userEmail.email = email;
      const url_api = this.url + '/admin/api/isChangePass';
      this.http.post(url_api, JSON.stringify(this.userEmail), this.httpOptions).subscribe((data) => {
        this.globals.isChangePass = (data['change_pass'] == 0) ? false : true;
      });
    }
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
    return this.http.post(url_api, uploadData, this.httpOptionsUpload);
  }

  testSchedule(){
    console.log("*** Test Schedule ***");
    console.log(this.globals.isChangePass);
  }

}
