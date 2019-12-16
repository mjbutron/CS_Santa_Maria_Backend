import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  isSidebarPinned = false;
  isSidebarToggeled = false;

  url = environment.urlApiRest;
  pathServerImg = environment.pathServerImage;

  httpOptions = {
  headers: new HttpHeaders({
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQHNtbWF0cm9uYXMuY29tIn0.ywKx_i8RfPOS17CQ5b_Le-QUuyBWMjMwti1SfdUO17Y"
    })
  };

  constructor(private http: HttpClient) { }

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
    return this.http.post(url_api, uploadData, this.httpOptions);
  }

}
