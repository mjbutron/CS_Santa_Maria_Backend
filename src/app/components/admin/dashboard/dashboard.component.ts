import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

import { DataApiService } from 'src/app/services/data-api.service';
import { SliderInterface } from 'src/app/models/slider-interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Slider
  sliderObj: SliderInterface;
  sliders: SliderInterface[] = [];
  // Errors
  errors = "";

  constructor(private dataApi: DataApiService, public toastr: ToastrService) {
    this.sliderObj = new SliderInterface();
  }

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
      this.dataApi.updateOrderSlider(slider, index).subscribe((data) => {
        console.log(data);
      });
      index++;
    }
    this.toastr.success('Se ha actualizado el orden de la cabecera!', 'Actualizado');
  }

  onSlider(slider: SliderInterface){
    console.log(slider);
    this.sliderObj = slider;
  }

  onSliderChange(form: NgForm){
    console.log(form);
    if(form.invalid){
      return;
    }
  }

  onFileChanged($event){
    // console.log("Subida");
    // const file = event.target.files[0];
    // console.log(file.name);
  }

}
