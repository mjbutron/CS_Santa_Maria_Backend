import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, catchError, retry, retryWhen, shareReplay } from 'rxjs/operators';

import { UserInterface } from 'src/app/models/user-interface';

const DEFAULT_MAX_RETRIES = 5;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.urlApiRest;
  userToken: string;

  constructor(private http: HttpClient) {
    this.getTokenStorage();
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
        }),
        this.delayRetry(2000, 3),
        catchError( err => {
          return of( err.value.error );
        }),
        shareReplay()
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
    localStorage.removeItem('email');
    this.userToken = '';
    return (this.userToken == '') ? true : false;
  }

}
