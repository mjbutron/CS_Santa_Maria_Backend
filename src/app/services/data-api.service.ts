import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { SliderInterface } from '../models/slider-interface';

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

  getAllSlider(){
    const url_api = this.url + '/api/allSlider';
    return this.http.get(url_api);
  }

  updateOrderSlider(slider: SliderInterface, orderSlider: Number){
    slider.order_slider = orderSlider;
    const url_api = this.url + '/admin/api/slider/update/' + slider.id;
    return this.http.put(url_api, JSON.stringify(slider), this.httpOptions);
  }

}
