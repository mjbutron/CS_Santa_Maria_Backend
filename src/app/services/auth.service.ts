import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

import { UserInterface } from 'src/app/models/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.urlApiRest;
  userToken: string;

  constructor(private http: HttpClient) {
    this.getTokenStorage();
  }

  login( user: UserInterface){
    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/login`,
      authData).pipe(
        map(res => {
          this.saveToken(res['token']);
          return res;
        })
      );
  }

  private saveToken(idToken: string){
    this.userToken = idToken;
    localStorage.setItem('accessTkn', idToken);
  }

  getTokenStorage(){
    if(localStorage.getItem('accessTkn')){
      this.userToken = localStorage.getItem('accessTkn');
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }

  isAuthenticated(): boolean {
    return this.userToken.length > 10;
  }

  logout(): boolean {
    localStorage.removeItem('accessTkn');
    localStorage.removeItem('username');
    localStorage.removeItem('rolname');
    this.userToken = '';
    return (this.userToken == '') ? true : false;
  }

}
