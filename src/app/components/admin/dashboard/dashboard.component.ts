import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { DataApiService } from 'src/app/services/data-api.service';
import { SliderInterface } from '../../../models/slider-interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

 sliders: SliderInterface[] = [];
 errors = "";

  constructor(private dataApi: DataApiService) {}

  ngOnInit() {
    this.getSlider();
  }

  getSlider(){
    this.dataApi.getAllSlider()
    .subscribe((allSliders: SliderInterface[]) => {
      this.sliders = allSliders;
    }, (err) => {
      this.errors = err;
    });
  }

  drop(event: CdkDragDrop<SliderInterface[]>) {
    moveItemInArray(this.sliders, event.previousIndex, event.currentIndex);
    var index = 1;
    for(let slider of this.sliders){
      this.dataApi.updateOrderSlider(slider, index);
      index++;      
      //console.log(slider.id + slider.order_slider);
    }

  }

  onFileChanged($event){
    // console.log("Subida");
    // const file = event.target.files[0];
    // console.log(file.name);
  }

}
