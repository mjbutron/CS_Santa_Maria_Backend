import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { SliderInterface } from 'src/app/models/slider-interface';

const _BLANK = '';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Path
  path = "http://localhost/apiRest/uploads/";
  // Form
  disabledForm = true;
  // File
  selectedImg: File;
  uploadSucces: boolean;
  // Slider
  sliderObj: SliderInterface;
  sliderImg: string;
  // Carrousel
  sliders: SliderInterface[] = [];
  // Errors
  errors = "";

  constructor(private dataApi: DataApiService,
    public toastr: ToastrService,
    private coreService: CoreService,
    public _DomSanitizer: DomSanitizer) {
    this.sliderObj = new SliderInterface();
  }

  ngOnInit() {
    this.uploadSucces = false;
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
    this.sliderObj.id = slider.id;
    this.sliderObj.title = slider.title;
    this.sliderObj.description = slider.description;
    this.sliderObj.order_slider = slider.order_slider;
    this.sliderObj.color_text = slider.color_text;
    this.sliderObj.user_id = slider.user_id;
    this.sliderImg = slider.image;
    this.disabledForm = false;
  }

  onCancel(){
    this.sliderObj.id = 0;
    this.sliderObj.title = _BLANK;
    this.sliderObj.description = _BLANK;
    this.sliderObj.order_slider = 0;
    this.sliderObj.color_text = '#ffffff';
    this.sliderObj.user_id = 0;
    this.sliderObj.image = _BLANK;
    this.uploadSucces = false;
  }

  onSubmit(form: NgForm){
    console.log(form);
    if(form.invalid){
      return;
    }

    this.sliderObj.image = this.sliderImg;
    this.dataApi.updateSliderById(this.sliderObj).subscribe((data) => {
      console.log(data);
      this.getSlider();
    });

  }

  onFileChanged($event){
    this.selectedImg = $event.target.files[0];
    this.coreService.uploadFiles(this.selectedImg).subscribe((data) => {
      this.uploadSucces = true;
      this.sliderImg = data.message;
    });
  }

}
