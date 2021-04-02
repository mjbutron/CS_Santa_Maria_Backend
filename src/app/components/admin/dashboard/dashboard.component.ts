import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
const K_NO_DATE = '--/--/----';
const K_NUM_ZERO = 0;
const K_COD_OK = 200;

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
  progress: number = 0;
  changeImage = false;
  // Slider
  sliderObj: SliderInterface;
  sliderImg: string;
  // Slider - Carrousel
  sliders: SliderInterface[] = [];
  // Service
  services: ServiceInterface[] = [];
  numSrv: number;
  isLastSrv = false;
  lastDateSrv: string;
  // Workshop
  wspInHome: WorkshopInterface[] = [];
  numWsp: number;
  isNextWsp = false;
  nextDateWsp: string;
  // Course
  course: CourseInterface[] = [];
  numCrs: number;
  isNextCrs = false;
  nextDateCrs: string;
  // Opinions
  opnInHome: OpinionInterface[] = [];
  numOpn: number;
  isLastOpn = false;
  nextDateOpn: string;
  // Errors
  errors = "";
  // Load
  isLoaded: boolean;
  // Today date
  todayDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.sliderObj = new SliderInterface();
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.uploadSuccess = false;
    this.changeImage = false;
    this.isLoaded = false;
    this.getAllServices();
    this.getAllWorkshops();
    this.getAllSlider();
    this.getAllCourses();
    this.getAllOpinions();
  }

  getAllServices(){
    this.dataApi.getAllServices().subscribe((data) => {
      if (K_COD_OK == data.cod){
        if(0 < data['allServices'].length){
          this.services = data['allServices'];
          this.numSrv = data['allServices'].length;
          this.lastDateSrv = this.services[0].create_date;
          this.isLastSrv = true;
        }
        else{
          this.isLastSrv = false;
          this.numSrv = K_NUM_ZERO;
          this.lastDateSrv = K_NO_DATE;
        }
        this.isLoaded = true;
      } else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
      }
    });
  }

  getAllWorkshops(){
    this.dataApi.getAllWorkshops().subscribe((data) => {
      if (K_COD_OK == data.cod){
        if(0 < data['allWorkshops'].length){
          for(let wspHome of data['allWorkshops']){
            if(wspHome.home == 1){
              this.wspInHome.push(wspHome);
            }
          }
          this.numWsp = data['allWorkshops'].length;
          for(let wspDate of data['allWorkshops']){
            if(!this.isNextWsp && this.todayDate < wspDate.session_date){
              this.isNextWsp = true;
              this.nextDateWsp = wspDate.session_date;
            }
          }
          if(!this.isNextWsp){
            this.nextDateWsp = K_NO_DATE;
          }
        }
        else{
          this.isNextWsp = false;
          this.numWsp = K_NUM_ZERO;
          this.nextDateWsp = K_NO_DATE;
        }
        this.isLoaded = true;
      } else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
      }
    });
  }

  getAllSlider(){
    this.dataApi.getAllSlider().subscribe((data) => {
      if (K_COD_OK == data.cod){
        this.sliders = data['allSliders'];
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
      }
    });
  }

  getAllCourses(){
    this.dataApi.getAllCourses().subscribe((data) => {
        if (K_COD_OK == data.cod){
          if(0 < data['allCourses'].length){
            this.course = data['allCourses'];
            this.numCrs = data['allCourses'].length;
            for(let crsDate of data['allCourses']){
              if(!this.isNextCrs && this.todayDate < crsDate.session_date){
                this.isNextCrs = true;
                this.nextDateCrs = crsDate.session_date;
              }
            }
            if(!this.isNextCrs){
              this.nextDateCrs = K_NO_DATE;
            }
          }
          else{
            this.isNextCrs = false;
            this.numCrs = K_NUM_ZERO;
            this.nextDateCrs = K_NO_DATE;
          }
          this.isLoaded = true;
        } else{
          this.isLoaded = true;
          this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
        }
    });
  }

  getAllOpinions() {
    this.dataApi.getAllOpinions().subscribe((data) => {
      if (K_COD_OK == data.cod){
        if(0 < data['allOpinions'].length){
          for(let opnHome of data['allOpinions']){
            if(opnHome.home == 1){
              this.opnInHome.push(opnHome);
            }
          }
          this.numOpn = data['allOpinions'].length;
          this.nextDateOpn = data['allOpinions'][0].create_date;
          this.isLastOpn = true;
        }
        else{
          this.isLastOpn = false;
          this.numOpn = K_NUM_ZERO;
          this.nextDateOpn = K_NO_DATE;
        }
        this.isLoaded = true;
      } else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
      }
    });
  }

  drop(event: CdkDragDrop<SliderInterface[]>) {
    this.isLoaded = false;
    moveItemInArray(this.sliders, event.previousIndex, event.currentIndex);
    let index = 1;
    let canContinue = 0;
    let error = false;
    for(let slider of this.sliders){
      this.dataApi.updateOrderSlider(slider, index).subscribe((data) => {
        if (K_COD_OK != data.cod){
          error = true;
        }
        canContinue++;

        if(!error && 3 == canContinue){
          this.isLoaded = true;
          this.toastr.success('Se ha modificado el orden de la cabecera', 'Actualizado');
        }
        if(error && 3 == canContinue){
          this.isLoaded = true;
          this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
        }
      });
      index++;
    }
  }

  onSlider(slider: SliderInterface){
    this.changeImage = false;
    this.sliderObj.id = slider.id;
    this.sliderObj.title = slider.title;
    this.sliderObj.description = slider.description;
    this.sliderObj.order_slider = slider.order_slider;
    this.sliderObj.color_text = slider.color_text;
    this.sliderObj.user_id = slider.user_id;
    this.sliderObj.image = (slider.image) ? slider.image : "default_image.jpg";
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
    this.isLoaded = false;
    if(form.invalid){
      return;
    }
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.sliderImg = img['message'];
          this.sliderObj.image = this.sliderImg;
          this.uploadSuccess = false;
          this.dataApi.updateSliderById(this.sliderObj).subscribe((data) => {
            if (K_COD_OK == data.cod){
              this.getAllSlider();
              this.disabledForm = true;
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success('Se ha editado la cabecera', 'Actualizado');
            } else{
              this.isLoaded = true;
              this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
            }
          });
        });
      }
      else {
        this.dataApi.updateSliderById(this.sliderObj).subscribe((data) => {
          if (K_COD_OK == data.cod){
            this.getAllSlider();
            this.disabledForm = true;
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success('Se ha editado la cabecera', 'Actualizado');
          } else{
            this.isLoaded = true;
            this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
          }
        });
      }

  }

  onFileChanged($event){
    if($event != null){
      this.selectedImg = $event.target.files[0];
      if(this.selectedImg.size > K_MAX_SIZE){
        this.imageFile.nativeElement.value = K_BLANK;
        this.changeImage = false;
        this.toastr.error('El tamaño no puede ser superior a 3MB.', 'Error');
        return;
      } else{
        for(let i=0; i<=100; i++){
          setTimeout(() => {
              this.progress = i; // Simulación de progreso
          }, 500);
        }
        this.changeImage = true;
        this.uploadSuccess = true;
        setTimeout(() => {
            this.progress = 0; // Eliminación de la barra de progreso
        }, 2500);
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
