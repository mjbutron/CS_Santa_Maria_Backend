import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { SliderInterface } from 'src/app/models/slider-interface';
import { ServiceInterface } from 'src/app/models/service-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;

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
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Slider - Image
  selectedImg: File;
  uploadSuccess: boolean;
  // Slider
  sliderObj: SliderInterface;
  sliderImg: string;
  // Slider - Carrousel
  sliders: SliderInterface[] = [];
  // Service
  services: ServiceInterface[] = [];
  numSrv: number;
  lastDateSrv: string;
  // Errors
  errors = "";

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.sliderObj = new SliderInterface();
  }

  ngOnInit() {
    this.uploadSuccess = false;
    this.getAllServices();
    this.getAllSlider();
  }

  getAllServices(){
    this.dataApi.getAllServices()
    .subscribe((allServices: ServiceInterface[]) => {
      this.services = allServices;
      this.numSrv = allServices.length;
      this.lastDateSrv = this.services[0].create_date;
    }, (err) => {
      this.errors = err;
    });
  }

  getAllSlider(){
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
    this.toastr.success('Se ha modificado el orden de la cabecera', 'Actualizado');
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
    this.sliderObj.title = K_BLANK;
    this.sliderObj.description = K_BLANK;
    this.imageFile.nativeElement.value = K_BLANK;
    this.sliderObj.order_slider = 0;
    this.sliderObj.color_text = '#ffffff';
    this.sliderObj.user_id = 0;
    this.sliderObj.image = K_BLANK;
    this.uploadSuccess = false;
    this.disabledForm = true;
  }

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }
    this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
      this.sliderImg = img['message'];
      this.sliderObj.image = this.sliderImg;
      this.dataApi.updateSliderById(this.sliderObj).subscribe((data) => {
        this.getAllSlider();
        this.disabledForm = true;
        this.onCancel();
        this.toastr.success('Se ha editado la cabecera', 'Actualizado');
      });
    });
  }

  onFileChanged($event){
    if($event != null){
      this.selectedImg = $event.target.files[0];
      if(this.selectedImg.size > K_MAX_SIZE){
        this.imageFile.nativeElement.value = K_BLANK;
        this.toastr.error('El tamaño no puede ser superior a 3MB.', 'Error');
        return;
      } else{
        this.uploadSuccess = true;
      }
    } else{
      return;
    }
  }
}
