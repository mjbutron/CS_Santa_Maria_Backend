import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, catchError, retry, retryWhen, shareReplay } from 'rxjs/operators';
// Interfaces
import { SliderInterface } from '../models/slider-interface';
import { ContactInterface } from 'src/app/models/contact-interface';
import { WorkshopInterface } from 'src/app/models/workshop-interface';
import { OpinionInterface } from 'src/app/models/opinion-interface';
import { CourseInterface } from 'src/app/models/course-interface';
import { ServiceInterface } from 'src/app/models/service-interface';
import { AboutUsInterface } from 'src/app/models/aboutus-interface';
import { UserInterface } from 'src/app/models/user-interface';
// Constants
const DEFAULT_MAX_RETRIES = 5;

@Injectable({
  providedIn: 'root'
})
export class DataApiService {
  // URL API
  url = environment.urlApiRest;
  // Retry
  retries: number = 3;
  delay_ms:number = 2000;

  // User email
  userEmail = {
    email: ""
  };

  /**
   * Constructor
   * @param http  HttpClient module
   */
  constructor(private http: HttpClient) { }

  /**
   * Headers options
   * @return Http header object with the given values.
   */
  getHeadersOptions() {
    return {
      headers: new HttpHeaders({
        "Content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('accessTkn')
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
   * Get all images for slider
   * @return An Observable of the response body as a JSON object
   */
  getAllSlider() {
    const url_api = this.url + '/api/allSlider';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update slider by ID
   * @param  slider Slider to modify
   * @return An Observable of the response body as a JSON object
   */
  updateSliderById(slider: SliderInterface) {
    const url_api = this.url + '/admin/api/slider/update/' + slider.id;
    return this.http.put(url_api, JSON.stringify(slider), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Allows modifying the order of the slider images
   * @param  slider Slider
   * @param  orderSlider  New order
   * @return An Observable of the response body as a JSON object
   */
  updateOrderSlider(slider: SliderInterface, orderSlider: number) {
    slider.order_slider = orderSlider;
    const url_api = this.url + '/admin/api/slider/update/' + slider.id;
    return this.http.put(url_api, JSON.stringify(slider), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get all services
   * @return An Observable of the response body as a JSON object
   */
  getAllServices() {
    const url_api = this.url + '/api/allServices';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get services by page
   * @param  page Page number to show
   * @return An Observable of the response body as a JSON object
   */
  getServicesByPage(page: Number) {
    const url_api = this.url + '/api/servicesByPage/' + page;
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Create service
   * @param  service Service to create
   * @return An Observable of the response body as a JSON object
   */
  createService(service: ServiceInterface) {
    const url_api = this.url + '/admin/api/services/new';
    return this.http.post(url_api, JSON.stringify(service), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update service by ID
   * @param  service Service to modify
   * @return An Observable of the response body as a JSON object
   */
  updateServiceById(service: ServiceInterface) {
    const url_api = this.url + '/admin/api/services/update/' + service.id;
    return this.http.put(url_api, JSON.stringify(service), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Delete service by ID
   * @param  serviceId Service ID
   * @return An Observable of the response body as a JSON object
   */
  deleteServiceById(serviceId: number) {
    const url_api = this.url + '/admin/api/services/delete/' + serviceId;
    return this.http.delete(url_api, this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get all workshops
   * @return An Observable of the response body as a JSON object
   */
  getAllWorkshops() {
    const url_api = this.url + '/api/allWorkshops';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get workshops by page
   * @param  page Page number to show
   * @return An Observable of the response body as a JSON object
   */
  getWorkShopsByPage(page: Number) {
    const url_api = this.url + '/api/workshopsByPage/' + page;
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Create workshop
   * @param  workshop Workshop to create
   * @return An Observable of the response body as a JSON object
   */
  createWorkshop(workshop: WorkshopInterface) {
    const url_api = this.url + '/admin/api/workshops/new';
    return this.http.post(url_api, JSON.stringify(workshop), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update workshop by ID
   * @param  workshop Workshop to modify
   * @return An Observable of the response body as a JSON object
   */
  updateWorkshopById(workshop: WorkshopInterface) {
    const url_api = this.url + '/admin/api/workshops/update/' + workshop.id;
    return this.http.put(url_api, JSON.stringify(workshop), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Delete workshop by ID
   * @param  workshopId Workshop ID
   * @return An Observable of the response body as a JSON object
   */
  deleteWorkshopById(workshopId: number) {
    const url_api = this.url + '/admin/api/workshops/delete/' + workshopId;
    return this.http.delete(url_api, this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get all courses
   * @return An Observable of the response body as a JSON object
   */
  getAllCourses() {
    const url_api = this.url + '/api/courses';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get courses by page
   * @param  page Page number to show
   * @return An Observable of the response body as a JSON object
   */
  getCoursesByPage(page: Number) {
    const url_api = this.url + '/api/coursesByPage/' + page;
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Create course
   * @param  course Course to create
   * @return An Observable of the response body as a JSON object
   */
  createCourse(course: CourseInterface) {
    const url_api = this.url + '/admin/api/courses/new';
    return this.http.post(url_api, JSON.stringify(course), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update course by ID
   * @param  course Course to modify
   * @return An Observable of the response body as a JSON object
   */
  updateCourseById(course: CourseInterface) {
    const url_api = this.url + '/admin/api/courses/update/' + course.id;
    return this.http.put(url_api, JSON.stringify(course), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Delete course by ID
   * @param  courseId Course ID
   * @return An Observable of the response body as a JSON object
   */
  deleteCourseById(courseId: number) {
    const url_api = this.url + '/admin/api/courses/delete/' + courseId;
    return this.http.delete(url_api, this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get home information
   * @return An Observable of the response body as a JSON object
   */
  getInfoHome() {
    const url_api = this.url + '/api/home/info';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get footer information
   * @return An Observable of the response body as a JSON object
   */
  getInfoFooter() {
    const url_api = this.url + '/api/footer/info';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get contact information
   * @return An Observable of the response body as a JSON object
   */
  getInfoContact() {
    const url_api = this.url + '/api/contact/info';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update home information
   * @param  infoHome Information to update
   * @return An Observable of the response body as a JSON object
   */
  updateInfoHomeById(infoHome: ContactInterface) {
    const url_api = this.url + '/admin/api/home/info/update/' + infoHome.id;
    return this.http.put(url_api, JSON.stringify(infoHome), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update footer information
   * @param  infoFooter Information to update
   * @return An Observable of the response body as a JSON object
   */
  updateInfoFooterById(infoFooter: ContactInterface) {
    const url_api = this.url + '/admin/api/footer/info/update/' + infoFooter.id;
    return this.http.put(url_api, JSON.stringify(infoFooter), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update contact information
   * @param  infoContact Information to update
   * @return An Observable of the response body as a JSON object
   */
  updateInfoContactById(infoContact: ContactInterface) {
    const url_api = this.url + '/admin/api/contact/info/update/' + infoContact.id;
    return this.http.put(url_api, JSON.stringify(infoContact), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get all opinions
   * @return An Observable of the response body as a JSON object
   */
  getAllOpinions() {
    const url_api = this.url + '/api/allOpinion';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get opinions by page
   * @param  page Page number to show
   * @return An Observable of the response body as a JSON object
   */
  getOpinionsByPage(page: Number) {
    const url_api = this.url + '/api/opinionsByPage/' + page;
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Create opinion
   * @param  opinion Opinion to create
   * @return An Observable of the response body as a JSON object
   */
  createOpinion(opinion: OpinionInterface) {
    const url_api = this.url + '/admin/api/opinions/new';
    return this.http.post(url_api, JSON.stringify(opinion), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update opinion by ID
   * @param  opinion Opinion to modify
   * @return An Observable of the response body as a JSON object
   */
  updateOpinionById(opinion: OpinionInterface) {
    const url_api = this.url + '/admin/api/opinions/update/' + opinion.id;
    return this.http.put(url_api, JSON.stringify(opinion), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Delete opinion by ID
   * @param  opinionId Opinion ID
   * @return An Observable of the response body as a JSON object
   */
  deleteOpinionById(opinionId: number) {
    const url_api = this.url + '/admin/api/opinions/delete/' + opinionId;
    return this.http.delete(url_api, this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get all profiles
   * @return An Observable of the response body as a JSON object
   */
  getAllAboutUs() {
    const url_api = this.url + '/api/allAboutUs';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get profiles by page
   * @param  page Page number to show
   * @return An Observable of the response body as a JSON object
   */
  getAboutUsByPage(page: Number) {
    const url_api = this.url + '/api/aboutUsByPage/' + page;
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Create new profile
   * @param  aboutus Profile to create
   * @return An Observable of the response body as a JSON object
   */
  createAboutUs(aboutus: AboutUsInterface) {
    const url_api = this.url + '/admin/api/aboutus/new';
    return this.http.post(url_api, JSON.stringify(aboutus), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update profile by ID
   * @param  aboutus Profile to modify
   * @return An Observable of the response body as a JSON object
   */
  updateAboutUsById(aboutus: AboutUsInterface) {
    const url_api = this.url + '/admin/api/aboutus/update/' + aboutus.id;
    return this.http.put(url_api, JSON.stringify(aboutus), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Delete profile by ID
   * @param  aboutusId Profile ID
   * @return An Observable of the response body as a JSON object
   */
  deleteAboutUsId(aboutusId: number) {
    const url_api = this.url + '/admin/api/aboutus/delete/' + aboutusId;
    return this.http.delete(url_api, this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get user profile
   * @param  user Login information
   * @return An Observable of the response body as a JSON object
   */
  getUserProfile(user: UserInterface) {
    const url_api = this.url + '/admin/api/userProfile';
    return this.http.post(url_api, JSON.stringify(user), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update user profile
   * @param  user User information to update
   * @return An Observable of the response body as a JSON object
   */
  updateUserProfile(user: UserInterface) {
    const url_api = this.url + '/admin/api/userProfile/update/' + user.id;
    return this.http.put(url_api, JSON.stringify(user), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update user password
   * @param  user    User
   * @param  newPass New password
   * @return An Observable of the response body as a JSON object
   */
  updatePassword(user: UserInterface, newPass: string) {
    user.password = newPass;
    const url_api = this.url + '/admin/api/userProfile/updatePass/' + user.id;
    return this.http.put(url_api, JSON.stringify(user), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Check password
   * @param  user     User
   * @param  currPass Current password
   * @return An Observable of the response body as a JSON object
   */
  checkPassword(user: UserInterface, currPass: string) {
    user.password = currPass;
    const url_api = this.url + '/admin/api/checkPassword';
    return this.http.post(url_api, JSON.stringify(user), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Logout
   * @param  email User email
   * @return An Observable of the response body as a JSON object
   */
  logout(email: string) {
    this.userEmail.email = email;
    const url_api = this.url + '/admin/logout';
    return this.http.put(url_api, JSON.stringify(this.userEmail), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get all roles
   * @return An Observable of the response body as a JSON object
   */
  getAllRoles() {
    const url_api = this.url + '/api/allRoles';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get all users
   * @return An Observable of the response body as a JSON object
   */
  getAllUsers() {
    const url_api = this.url + '/api/allUsers';
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Get all users by page
   * @param  page Page number to show
   * @return An Observable of the response body as a JSON object
   */
  getUsersByPage(page: Number) {
    const url_api = this.url + '/api/usersByPage/' + page;
    return this.http.get(url_api)
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Create new user
   * @param  user User information to create
   * @return An Observable of the response body as a JSON object
   */
  createUser(user: UserInterface) {
    const url_api = this.url + '/admin/api/users/new';
    return this.http.post(url_api, JSON.stringify(user), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Update user
   * @param  user User information to modify
   * @return An Observable of the response body as a JSON object
   */
  updateUserById(user: UserInterface) {
    const url_api = this.url + '/admin/api/users/update/' + user.id;
    return this.http.put(url_api, JSON.stringify(user), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Delete user by ID
   * @param  userId User ID
   * @return An Observable of the response body as a JSON object
   */
  deleteUserById(userId: number) {
    const url_api = this.url + '/admin/api/users/delete/' + userId;
    return this.http.delete(url_api, this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }

  /**
   * Validate email
   * @param  user User information with email
   * @return An Observable of the response body as a JSON object
   */
  validateEmail(user: UserInterface) {
    const url_api = this.url + '/admin/api/validateEmail';
    return this.http.post(url_api, JSON.stringify(user), this.getHeadersOptions())
      .pipe(
        this.delayRetry(this.delay_ms, this.retries),
        catchError(err => {
          return of(err.value.error);
        }),
        shareReplay()
      )
  }
}
