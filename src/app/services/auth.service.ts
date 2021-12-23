import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Globals } from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, catchError, retry, retryWhen, shareReplay } from 'rxjs/operators';
import * as globalsConstants from 'src/app/common/globals';
// Services
import { UserInterface } from 'src/app/models/user-interface';

const DEFAULT_MAX_RETRIES = 5;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL API
  private url = environment.urlApiRest;
  // User token
  userToken: string;
  // Globals
  globals: Globals;

  /**
   * Constructor
   * @param http  HttpClient module
   * @param globals Globals
   */
  constructor(private http: HttpClient, globals: Globals) {
    this.globals = globals;
    this.getTokenStorage();
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
   * Login user
   * @param  user User data
   * @return An Observable of the response body as a JSON object
   */
  login(user: UserInterface) {
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
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      );
  }

  /**
   * Save token in local storage
   * @param idToken  Token ID
   */
  private saveToken(idToken: string): void {
    this.userToken = idToken;
    localStorage.setItem(globalsConstants.K_LOGIN_STRG_ACCESSTKN, idToken);
  }

  /**
   * Get token ID from local storage
   */
  getTokenStorage(): void {
    if (localStorage.getItem(globalsConstants.K_LOGIN_STRG_ACCESSTKN)) {
      this.userToken = localStorage.getItem(globalsConstants.K_LOGIN_STRG_ACCESSTKN);
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  /**
   * Check if the user is logged in
   * @return True if the user is logged in and False if he is not logged in
   */
  isAuthenticated(): boolean {
    return this.userToken.length > 10;
  }

  /**
   * Logout user
   * @return True if the user has logged out and False if they have not logged out
   */
  logout(): boolean {
    localStorage.removeItem(globalsConstants.K_LOGIN_STRG_ACCESSTKN);
    localStorage.removeItem(globalsConstants.K_LOGIN_STRG_USER_NAME);
    localStorage.removeItem(globalsConstants.K_LOGIN_STRG_ROL_NAME);
    localStorage.removeItem(globalsConstants.K_LOGIN_STRG_USER_IMAGE);
    localStorage.removeItem(globalsConstants.K_LOGIN_STRG_EMAIL);
    this.userToken = '';
    return (this.userToken == '') ? true : false;
  }
}
