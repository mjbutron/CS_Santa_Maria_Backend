import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { CourseInterface } from 'src/app/models/course-interface';

// Constants
const K_DELETE_COURSE = '¿Seguro que deseas eliminar el curso?';
const K_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
const K_WARNING_ACTION = 'Atención: Esta acción no se puede deshacer.';
const K_DEACTIVE_COURSE = '¿Seguro que deseas desactivar este curso?';
const K_ACTIVE_COURSE = '¿Seguro que deseas activar este curso?';
const K_DEACTIVE_STR = '¡Desactivado!';
const K_ACTIVE_STR = '¡Activado!';
const K_DEACTIVE_SUCCESS_SRT = 'Se ha desactivado el curso.';
const K_ACTIVE_SUCCESS_SRT = 'Se ha activado el curso.';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  // Globals
  globals: Globals;
  // Path
  path = environment.imageRootPath;
  // Courses
  courseObj: CourseInterface;
  courses: CourseInterface[] = [];
  courseImg: string;
  inOfferChk: boolean;
  inNewChk: boolean;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Courses - Image
  selectedImg: File;
  uploadSuccess: boolean;
  progress: number = 0;
  // Errors
  errors = "";
  // Numeros páginas
  public numberPage: number[] = [];
  // Página actual
  public page: number = 1;
  // Total de paginas
  public totalPages: number;
  // Total de elementos
  public numCourses: number;
  // Elementos por página
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editCourse", { static: false }) editCourse: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;
  // Utils
  alertActiveStr = "";
  actionActiveStr = "";
  actionTextActiveStr = "";
  // Load
  isLoaded: boolean;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService, globals: Globals) {
    this.globals = globals;
    this.courseObj = new CourseInterface();
    this.inOfferChk = false;
    this.inNewChk = false;
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.isLoaded = false;
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.getCoursesByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getCoursesByPage(page);
  }

  getCoursesByPage(page: Number) {
    this.dataApi.getCoursesByPage(page).subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod){
        this.courses = data.allCourses;
        this.numCourses = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else{
        this.numCourses = globalsConstants.K_ZERO_RESULTS;
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onReload(){
    this.getCoursesByPage(this.page);
  }

  onNewCourse() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;
    this.inOfferChk = false;
    this.inNewChk = true;

    this.courseObj.id = null;
    this.courseObj.title = globalsConstants.K_BLANK;;
    this.courseObj.description = globalsConstants.K_BLANK;;
    this.courseObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.courseObj.new_course = 1;
    this.courseObj.offer = 0;
    this.courseObj.address = globalsConstants.K_BLANK;;
    this.courseObj.session_date = globalsConstants.K_BLANK;;
    this.courseObj.session_start = globalsConstants.K_BLANK;;
    this.courseObj.session_end = globalsConstants.K_BLANK;;
    this.courseObj.sessions = 0;
    this.courseObj.hours = 0;
    this.courseObj.level = globalsConstants.K_BLANK;;
    this.courseObj.places = 0;
    this.courseObj.free_places = 0;
    this.courseObj.price = 0;
    this.courseObj.user_id = this.globals.userID;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditCourse(course: CourseInterface) {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    // Setear valores al ui
    this.courseObj.id = course.id;
    this.courseObj.title = course.title;
    this.courseObj.description = course.description;
    this.courseObj.image = (course.image) ? course.image : globalsConstants.K_DEFAULT_IMAGE;
    this.courseObj.new_course = course.new_course;
    this.inNewChk = (course.new_course == 1) ? true : false;
    this.courseObj.offer = course.offer;
    this.inOfferChk = (course.offer == 1) ? true : false;
    this.courseObj.address = course.address;
    this.courseObj.session_date = course.session_date;
    this.courseObj.session_start = course.session_start;
    this.courseObj.session_end = course.session_end;
    this.courseObj.sessions = course.sessions;
    this.courseObj.hours = course.hours;
    this.courseObj.level = course.level;
    this.courseObj.places = course.places;
    this.courseObj.free_places = course.free_places;
    this.courseObj.price = course.price;
    this.courseObj.user_id = this.globals.userID;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteCourse(course: CourseInterface){
    Swal.fire({
      title: K_DELETE_COURSE,
      text: K_WARNING_ACTION,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_CONFIRM_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        this.dataApi.deleteCourseById(course.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getCoursesByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.uploadSuccess = false;
            this.changeImage = false;
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_DELETE_EXC_STR,
              data.message,
              'success'
            )
          } else{
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_ERROR_EXC_STR,
              data.message,
              'error'
            )
          }
        });
      }
    });
  }

  onEditImage(){
    this.changeImage = true;
  }

  onCancelEditImage(){
    this.changeImage = false;
  }

  onDeleteImage() {
    if(globalsConstants.K_DEFAULT_IMAGE != this.courseObj.image){
      Swal.fire({
        title: K_DELETE_IMAGE,
        text: K_WARNING_ACTION,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
        cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
        confirmButtonText: globalsConstants.K_CONFIRM_BUTTON_STR,
        cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
      }).then((result) => {
        if (result.value) {
          this.isLoaded = false;
          this.courseObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateCourseById(this.courseObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getCoursesByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              Swal.fire(
                globalsConstants.K_DELETE_IMAGE_STR,
                globalsConstants.K_DELETE_IMG_SUCCESS,
                'success'
              )
            }
            else{
              this.isLoaded = true;
              Swal.fire(
                globalsConstants.K_ERROR_EXC_STR,
                data.message,
                'error'
              )
            }
          });
        }
      });
    }
    else {
      this.toastr.info(globalsConstants.K_NO_IMAGE_INFO, globalsConstants.K_INFO_STR);
    }
  }

  onSubmit(form: NgForm){
    this.isLoaded = false;
    if(this.isEditForm){
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.courseImg = img['message'];
          this.courseObj.image = this.courseImg;
          this.uploadSuccess = false;
          this.dataApi.updateCourseById(this.courseObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getCoursesByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_UPDATE_STR);
            } else{
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else{
        this.dataApi.updateCourseById(this.courseObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getCoursesByPage(this.page);
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_UPDATE_STR);
          } else{
            this.isLoaded = true;
            this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
          }
        });
      }
    } else{
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.courseImg = img['message'];
          this.courseObj.image = this.courseImg;
          this.uploadSuccess = false;
          this.dataApi.createCourse(this.courseObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getCoursesByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_ADD_STR);
            } else{
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else{
        this.dataApi.createCourse(this.courseObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getCoursesByPage(this.page);
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_ADD_STR);
          } else{
            this.isLoaded = true;
            this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
          }
        });
      }
    }
  }

  onFileChanged($event){
    if($event != null){
      this.selectedImg = $event.target.files[0];
      if(this.selectedImg.size > globalsConstants.K_MAX_SIZE){
        this.imageFile.nativeElement.value = globalsConstants.K_BLANK;
        this.toastr.error(globalsConstants.K_ERROR_SIZE, globalsConstants.K_ERROR_STR);
        return;
      } else{
        for(let i=0; i<=100; i++){
          setTimeout(() => {
              this.progress = i; // Simulación de progreso
          }, 500);
        }
        this.uploadSuccess = true;
        setTimeout(() => {
            this.progress = 0; // Eliminación de la barra de progreso
        }, 2500);
      }
    } else{
      return;
    }
  }

  onCancel(){
    // form.reset();
    this.isEditForm = false;
    this.activeForm = false;
    this.uploadSuccess = false;
    this.changeImage = false;
  }

  scrollToForm() {
      this.editCourse.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  toggleVisibility(e){
    this.courseObj.new_course = (this.inNewChk) ? 1 : 0;
    this.courseObj.offer = (this.inOfferChk) ? 1 : 0;
  }

  onActiveCourse(course: CourseInterface){
    let auxActive = 0;
    if(1 == course.active){
      this.alertActiveStr = K_DEACTIVE_COURSE;
      this.actionActiveStr = K_DEACTIVE_STR;
      this.actionTextActiveStr = K_DEACTIVE_SUCCESS_SRT;
      auxActive = 1;
    }
    else{
      this.alertActiveStr = K_ACTIVE_COURSE;
      this.actionActiveStr = K_ACTIVE_STR;
      this.actionTextActiveStr = K_ACTIVE_SUCCESS_SRT;
      auxActive = 0;
    }

    Swal.fire({
      title: this.alertActiveStr,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_OK_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        course.user_id = this.globals.userID;
        // Posibilidad de nuevo servicio en data-api.service para activar/desactivar
        course.active = (course.active == 0) ? 1 : 0; // Así no tener que hacer esto
        this.dataApi.updateCourseById(course).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getCoursesByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              this.actionActiveStr,
              this.actionTextActiveStr,
              'success'
            )
          } else{
            course.active = auxActive;
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_ERROR_EXC_STR,
              data.message,
              'error'
            )
          }
        });
      }
    });
  }
}
