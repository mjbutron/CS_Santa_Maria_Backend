import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { SliderInterface } from 'src/app/models/slider-interface';
import { ServiceInterface } from 'src/app/models/service-interface';
import { WorkshopInterface } from 'src/app/models/workshop-interface';
import { CourseInterface } from 'src/app/models/course-interface';
import { OpinionInterface } from 'src/app/models/opinion-interface';

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
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
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
  // Workshop
  wspInHome: WorkshopInterface[] = [];
  numWsp: number;
  nextDateWsp: string;
  // Course
  course: CourseInterface[] = [];
  numCrs: number;
  nextDateCrs: string;
  // Opinions
  opnInHome: OpinionInterface[] = [];
  numOpn: number;
  nextDateOpn: string;
  // Errors
  errors = "";
  // Load
  isLoaded: boolean;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.sliderObj = new SliderInterface();

    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.uploadSuccess = false;
    this.isLoaded = false;
    this.getAllServices();
    this.getAllWorkshops();
    this.getAllSlider();
    this.getAllCourses();
    this.getAllOpinions();
  }

  getAllServices(){
    this.dataApi.getAllServices()
    .subscribe((allServices: ServiceInterface[]) => {
      this.services = allServices;
      this.numSrv = allServices.length;
      this.lastDateSrv = this.services[0].create_date;
      this.isLoaded = true;
    }, (err) => {
      this.errors = err;
      this.isLoaded = false;
    });
  }

  getAllWorkshops(){
    this.dataApi.getAllWorkshops()
    .subscribe((allWorkshops: WorkshopInterface[]) => {
      for(let wspHome of allWorkshops){
        if(wspHome.home == 1){
          this.wspInHome.push(wspHome);
        }
      }
      this.numWsp = allWorkshops.length;
      this.nextDateWsp = allWorkshops[0].session_date;
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

  getAllCourses(){
    this.dataApi.getAllCourses()
    .subscribe((allCourses: CourseInterface[]) => {
      this.course = allCourses;
      this.numCrs = allCourses.length;
      this.nextDateCrs = this.course[0].create_date;
      this.isLoaded = true;
    }, (err) => {
      this.errors = err;
      this.isLoaded = false;
    });
  }

  getAllOpinions() {
    this.dataApi.getAllOpinions()
    .subscribe((allOpinions: OpinionInterface[]) => {
      for(let opnHome of allOpinions){
        if(opnHome.home == 1){
          this.opnInHome.push(opnHome);
        }
      }
      this.numOpn = allOpinions.length;
      this.nextDateOpn = allOpinions[0].create_date;
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

  counter(index: number) {
    let list = new Array();
    for(let i=0; i<index; i++){
      list.push(i);
    }
    return list;
  }
}
