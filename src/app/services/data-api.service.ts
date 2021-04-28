import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { of, throwError } from 'rxjs';
import { delay, mergeMap, catchError, retry, retryWhen, shareReplay } from 'rxjs/operators';

import { SliderInterface } from '../models/slider-interface';
import { ContactInterface } from 'src/app/models/contact-interface';
import { WorkshopInterface } from 'src/app/models/workshop-interface';
import { OpinionInterface } from 'src/app/models/opinion-interface';
import { CourseInterface } from 'src/app/models/course-interface';
import { ServiceInterface } from 'src/app/models/service-interface';
import { AboutUsInterface } from 'src/app/models/aboutus-interface';
import { UserInterface } from 'src/app/models/user-interface';

const getErrorMessage = (maxRetry: number) =>
'Tried to load resource over XHR for ' + maxRetry + ' times without success.';
const DEFAULT_MAX_RETRIES = 5;

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  url = environment.urlApiRest;

  userEmail = {
    email: ""
  };

  // httpOptions = {
  // headers: new HttpHeaders({
  //   "Content-type": "application/json",
  //   "Authorization": "Bearer "
  //   })
  // };

  constructor(private http: HttpClient) { }

  getHeadersOptions(){
    return {
    headers: new HttpHeaders({
      "Content-type": "application/json",
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
        mergeMap(error => retries-- > 0 ? of(error) : throwError(getErrorMessage(maxRetry)))
      ))
    );
  }

// SLIDER API
  getAllSlider(){
    const url_api = this.url + '/api/allSlider';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateSliderById(slider: SliderInterface){
    const url_api = this.url + '/admin/api/slider/update/' + slider.id;
    return this.http.put(url_api, JSON.stringify(slider), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateOrderSlider(slider: SliderInterface, orderSlider: number){
    slider.order_slider = orderSlider;
    const url_api = this.url + '/admin/api/slider/update/' + slider.id;
    return this.http.put(url_api, JSON.stringify(slider), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// SERVICES API
  getAllServices(){
    const url_api = this.url + '/api/allServices';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  getServicesByPage(page: Number){
    const url_api = this.url + '/api/servicesByPage/' + page;
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  createService(service: ServiceInterface){
    const url_api = this.url + '/admin/api/services/new';
    return this.http.post(url_api, JSON.stringify(service), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateServiceById(service: ServiceInterface){
    const url_api = this.url + '/admin/api/services/update/' + service.id;
    return this.http.put(url_api, JSON.stringify(service), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  deleteServiceById(serviceId: number){
    const url_api = this.url + '/admin/api/services/delete/' + serviceId;
    return this.http.delete(url_api, this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// WORKSHOP API
  getAllWorkshops(){
    const url_api = this.url + '/api/allWorkshops';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  getWorkShopsByPage(page: Number){
    const url_api = this.url + '/api/workshopsByPage/' + page;
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  createWorkshop(workshop: WorkshopInterface){
    const url_api = this.url + '/admin/api/workshops/new';
    return this.http.post(url_api, JSON.stringify(workshop), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateWorkshopById(workshop: WorkshopInterface){
    const url_api = this.url + '/admin/api/workshops/update/' + workshop.id;
    return this.http.put(url_api, JSON.stringify(workshop), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  deleteWorkshopById(workshopId: number){
    const url_api = this.url + '/admin/api/workshops/delete/' + workshopId;
    return this.http.delete(url_api, this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// COURSE API
  getAllCourses(){
    const url_api = this.url + '/api/courses';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  getCoursesByPage(page: Number) {
    const url_api = this.url + '/api/coursesByPage/' + page;
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  createCourse(course: CourseInterface){
    const url_api = this.url + '/admin/api/courses/new';
    return this.http.post(url_api, JSON.stringify(course), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateCourseById(course: CourseInterface){
    const url_api = this.url + '/admin/api/courses/update/' + course.id;
    return this.http.put(url_api, JSON.stringify(course), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  deleteCourseById(courseId: number){
    const url_api = this.url + '/admin/api/courses/delete/' + courseId;
    return this.http.delete(url_api, this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// CONTACT API
  getInfoHome(){
    const url_api = this.url + '/api/home/info';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  getInfoFooter(){
    const url_api = this.url + '/api/footer/info';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  getInfoContact(){
    const url_api = this.url + '/api/contact/info';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateInfoHomeById(infoHome: ContactInterface){
    const url_api = this.url + '/admin/api/home/info/update/' + infoHome.id;
    return this.http.put(url_api, JSON.stringify(infoHome), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateInfoFooterById(infoFooter: ContactInterface){
    const url_api = this.url + '/admin/api/footer/info/update/' + infoFooter.id;
    return this.http.put(url_api, JSON.stringify(infoFooter), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateInfoContactById(infoContact: ContactInterface){
    const url_api = this.url + '/admin/api/contact/info/update/' + infoContact.id;
    return this.http.put(url_api, JSON.stringify(infoContact), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// OPINIONS API
  getAllOpinions(){
    const url_api = this.url + '/api/allOpinion';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  getOpinionsByPage(page: Number){
    const url_api = this.url + '/api/opinionsByPage/' + page;
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  createOpinion(opinion: OpinionInterface){
    const url_api = this.url + '/admin/api/opinions/new';
    return this.http.post(url_api, JSON.stringify(opinion), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateOpinionById(opinion: OpinionInterface){
    const url_api = this.url + '/admin/api/opinions/update/' + opinion.id;
    return this.http.put(url_api, JSON.stringify(opinion), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  deleteOpinionById(opinionId: number){
    const url_api = this.url + '/admin/api/opinions/delete/' + opinionId;
    return this.http.delete(url_api, this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// ABOUTUS API
  getAllAboutUs(){
    const url_api = this.url + '/api/allAboutUs';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  getAboutUsByPage(page: Number){
    const url_api = this.url + '/api/aboutUsByPage/' + page;
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  createAboutUs(aboutus: AboutUsInterface){
    const url_api = this.url + '/admin/api/aboutus/new';
    return this.http.post(url_api, JSON.stringify(aboutus), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateAboutUsById(aboutus: AboutUsInterface){
    const url_api = this.url + '/admin/api/aboutus/update/' + aboutus.id;
    return this.http.put(url_api, JSON.stringify(aboutus), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  deleteAboutUsId(aboutusId: number){
    const url_api = this.url + '/admin/api/aboutus/delete/' + aboutusId;
    return this.http.delete(url_api, this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// USER PROFILE API
  getUserProfile(user: UserInterface){
    const url_api = this.url + '/admin/api/userProfile';
    return this.http.post(url_api, JSON.stringify(user), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateUserProfile(user: UserInterface){
    const url_api = this.url + '/admin/api/userProfile/update/' + user.id;
    return this.http.put(url_api, JSON.stringify(user), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updatePassword(user: UserInterface, newPass: string){
    user.password = newPass;
    const url_api = this.url + '/admin/api/userProfile/updatePass/' + user.id;
    return this.http.put(url_api, JSON.stringify(user), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  checkPassword(user: UserInterface, currPass: string){
    user.password = currPass;
    const url_api = this.url + '/admin/api/checkPassword';
    return this.http.post(url_api, JSON.stringify(user), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// USER LOGOUT
  logout(email: string){
    this.userEmail.email = email;
    const url_api = this.url + '/admin/logout';
    return this.http.put(url_api, JSON.stringify(this.userEmail), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// ROLES API
  getAllRoles(){
    const url_api = this.url + '/api/allRoles';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

// USERS API
  getAllUsers(){
    const url_api = this.url + '/api/allUsers';
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  getUsersByPage(page: Number){
    const url_api = this.url + '/api/usersByPage/' + page;
    return this.http.get(url_api)
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  createUser(user: UserInterface){
    const url_api = this.url + '/admin/api/users/new';
    return this.http.post(url_api, JSON.stringify(user), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  updateUserById(user: UserInterface){
    const url_api = this.url + '/admin/api/users/update/' + user.id;
    return this.http.put(url_api, JSON.stringify(user), this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }

  deleteUserById(userId: number){
    const url_api = this.url + '/admin/api/users/delete/' + userId;
    return this.http.delete(url_api, this.getHeadersOptions())
    .pipe(
      this.delayRetry(2000, 3),
      catchError( err => {
        console.error(err);
        return of( err );
      }),
      shareReplay()
    )
  }
}
