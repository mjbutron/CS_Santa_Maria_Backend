import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { SliderInterface } from '../models/slider-interface';
import { ContactInterface } from 'src/app/models/contact-interface';
import { WorkshopInterface } from 'src/app/models/workshop-interface';
import { OpinionInterface } from 'src/app/models/opinion-interface';

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  url = environment.urlApiRest;

  httpOptions = {
  headers: new HttpHeaders({
    "Content-type": "application/json",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQHNtbWF0cm9uYXMuY29tIn0.ywKx_i8RfPOS17CQ5b_Le-QUuyBWMjMwti1SfdUO17Y"
    })
  };

  constructor(private http: HttpClient) { }

// DASH API
  getCountServices(){
    const url_api = this.url + '/admin/api/statistics/countServices';
    return this.http.get(url_api, this.httpOptions);
  }

// SLIDER API
  getAllSlider(){
    const url_api = this.url + '/api/allSlider';
    return this.http.get(url_api);
  }

  updateSliderById(slider: SliderInterface){
    const url_api = this.url + '/admin/api/slider/update/' + slider.id;
    return this.http.put(url_api, JSON.stringify(slider), this.httpOptions);
  }

  updateOrderSlider(slider: SliderInterface, orderSlider: number){
    slider.order_slider = orderSlider;
    const url_api = this.url + '/admin/api/slider/update/' + slider.id;
    return this.http.put(url_api, JSON.stringify(slider), this.httpOptions);
  }

// SERVICES API
  getAllServices(){
    const url_api = this.url + '/api/allServices';
    return this.http.get(url_api);
  }

// WORKSHOP API
  getAllWorkshops(){
    const url_api = this.url + '/api/allWorkshops';
    return this.http.get(url_api);
  }

  getWorkShopsByPage(page: Number){
    const url_api = this.url + '/api/workshopsByPage/' + page;
    return this.http.get(url_api);
  }

  createWorkshop(workshop: WorkshopInterface){
    const url_api = this.url + '/admin/api/workshops/new';
    return this.http.post(url_api, JSON.stringify(workshop), this.httpOptions);
  }

  updateWorkshopById(workshop: WorkshopInterface){
    const url_api = this.url + '/admin/api/workshops/update/' + workshop.id;
    return this.http.put(url_api, JSON.stringify(workshop), this.httpOptions);
  }

  deleteWorkshopById(workshopId: number){
    const url_api = this.url + '/admin/api/workshops/delete/' + workshopId;
    return this.http.delete(url_api, this.httpOptions);
  }

// COURSE API
  getAllCourses(){
    const url_api = this.url + '/api/courses';
    return this.http.get(url_api);
  }

  getCoursesByPage(page: Number) {
    const url_api = this.url + '/api/coursesByPage/' + page;
    return this.http.get(url_api);
  }

// CONTACT API
  getInfoHome(){
    const url_api = this.url + '/api/home/info';
    return this.http.get(url_api);
  }

  getInfoFooter(){
    const url_api = this.url + '/api/footer/info';
    return this.http.get(url_api);
  }

  getInfoContact(){
    const url_api = this.url + '/api/contact/info';
    return this.http.get(url_api);
  }

  updateInfoHomeById(infoHome: ContactInterface){
    const url_api = this.url + '/admin/api/home/info/update/' + infoHome.id;
    return this.http.put(url_api, JSON.stringify(infoHome), this.httpOptions);
  }

  updateInfoFooterById(infoFooter: ContactInterface){
    const url_api = this.url + '/admin/api/footer/info/update/' + infoFooter.id;
    return this.http.put(url_api, JSON.stringify(infoFooter), this.httpOptions);
  }

  updateInfoContactById(infoContact: ContactInterface){
    const url_api = this.url + '/admin/api/contact/info/update/' + infoContact.id;
    return this.http.put(url_api, JSON.stringify(infoContact), this.httpOptions);
  }

// OPINIONS API
  getAllOpinions(){
    const url_api = this.url + '/api/allOpinion';
    return this.http.get(url_api);
  }

  getOpinionsByPage(page: Number){
    const url_api = this.url + '/api/opinionsByPage/' + page;
    return this.http.get(url_api);
  }

  createOpinion(opinion: OpinionInterface){
    const url_api = this.url + '/admin/api/opinions/new';
    return this.http.post(url_api, JSON.stringify(opinion), this.httpOptions);
  }

  updateOpinionById(opinion: OpinionInterface){
    const url_api = this.url + '/admin/api/opinions/update/' + opinion.id;
    return this.http.put(url_api, JSON.stringify(opinion), this.httpOptions);
  }

  deleteOpinionById(opinionId: number){
    const url_api = this.url + '/admin/api/opinions/delete/' + opinionId;
    return this.http.delete(url_api, this.httpOptions);
  }

}
