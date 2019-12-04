import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { SliderInterface } from '../models/slider-interface';

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  private url = environment.urlApiRest;
  headers : HttpHeaders = new HttpHeaders({
    "Content-type": "application/json"
  });

  constructor(private http: HttpClient) { }

  getAllSlider(){
    const url_api = this.url + '/api/allSlider';
    return this.http.get(url_api);
  }

  updateOrderSlider(slider: SliderInterface, orderSlider: Number){
    slider.order_slider = orderSlider;
    // console.log(slider);
    // console.log("Index: " + orderSlider);
    const url_api = this.url + '/admin/api/slider/update/' + slider.id;
    // return this.http.put(url_api, JSON.stringify(slider));
  }

}
