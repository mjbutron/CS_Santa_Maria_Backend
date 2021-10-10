import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-custom';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { ServiceInterface } from 'src/app/models/service-interface';

// Constants
const K_DELETE_SERV = '¿Seguro que deseas eliminar el servicio?';
const K_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
const K_WARNING_ACTION = 'Atención: Esta acción no se puede deshacer.';
const K_DEACTIVE_SERVICE = '¿Seguro que deseas desactivar este servicio?';
const K_ACTIVE_SERVICE = '¿Seguro que deseas activar este servicio?';
const K_DEACTIVE_STR = '¡Desactivado!';
const K_ACTIVE_STR = '¡Activado!';
const K_DEACTIVE_SUCCESS_SRT = 'Se ha desactivado el servicio.';
const K_ACTIVE_SUCCESS_SRT = 'Se ha activado el servicio.';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  // Editor
  public Editor = ClassicEditor;
  // Globals
  globals: Globals;
  // Path
  path = environment.imageRootPath;
  // Services
  serviceObj: ServiceInterface;
  services: ServiceInterface[] = [];
  serviceImg: string;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Services - Image
  selectedImg: File;
  uploadSuccess: boolean;
  progress: number = 0;
  // Numeros páginas
  public numberPage: number[] = [];
  // Página actual
  public page: number = 1;
  // Total de paginas
  public totalPages: number;
  // Total de elementos
  public numServices: number;
  // Elementos por página
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editService", { static: false }) editService: ElementRef;
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
    this.serviceObj = new ServiceInterface();
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.isLoaded = false;
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.getServicesByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getServicesByPage(page);
  }

  getServicesByPage(page: Number) {
    this.dataApi.getServicesByPage(page).subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod){
        this.services = data.allServices;
        this.numServices = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else{
        this.numServices = globalsConstants.K_ZERO_RESULTS;
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onReload(){
    this.getServicesByPage(this.page);
  }

  onNewService() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.serviceObj.id = null;
    this.serviceObj.active = 0;
    this.serviceObj.title = globalsConstants.K_BLANK;
    this.serviceObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.serviceObj.subtitle = globalsConstants.K_BLANK;
    this.serviceObj.description = globalsConstants.K_BLANK;
    this.serviceObj.user_id = this.globals.userID;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditService(service: ServiceInterface) {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    this.serviceObj.description = globalsConstants.K_BLANK;
    this.serviceObj.image = (service.image) ? service.image : globalsConstants.K_DEFAULT_IMAGE;

    setTimeout (() => {
          // Setear valores al ui
          this.serviceObj.id = service.id;
          this.serviceObj.active = service.active;
          this.serviceObj.title = service.title;
          this.serviceObj.subtitle = service.subtitle;
          this.serviceObj.description = service.description;
          this.serviceObj.user_id = this.globals.userID;
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteService(service: ServiceInterface){
    Swal.fire({
      title: K_DELETE_SERV,
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
        this.dataApi.deleteServiceById(service.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getServicesByPage(this.page);
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
            this.coreService.createNotification(
              globalsConstants.K_MOD_SERVICE, globalsConstants.K_DELETE_MOD, service.title,
              globalsConstants.K_ALL_USERS);
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
    if(globalsConstants.K_DEFAULT_IMAGE != this.serviceObj.image){
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
          this.serviceObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateServiceById(this.serviceObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getServicesByPage(this.page);
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
    if(form.invalid){
      this.isLoaded = true;
      return;
    }

    if(this.isEditForm){
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.serviceImg = img['message'];
          this.serviceObj.image = this.serviceImg;
          this.uploadSuccess = false;
          this.dataApi.updateServiceById(this.serviceObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getServicesByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_SERVICE, globalsConstants.K_UPDATE_MOD, this.serviceObj.title,
                globalsConstants.K_ALL_USERS);
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_UPDATE_STR);
            } else{
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else{
        this.dataApi.updateServiceById(this.serviceObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getServicesByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_SERVICE, globalsConstants.K_UPDATE_MOD, this.serviceObj.title,
              globalsConstants.K_ALL_USERS);
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
          this.serviceImg = img['message'];
          this.serviceObj.image = this.serviceImg;
          this.uploadSuccess = false;
          this.dataApi.createService(this.serviceObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getServicesByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_SERVICE, globalsConstants.K_INSERT_NEW_MOD, this.serviceObj.title,
                globalsConstants.K_ALL_USERS);
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_ADD_STR);
            } else{
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else{
        this.dataApi.createService(this.serviceObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getServicesByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_SERVICE, globalsConstants.K_INSERT_NEW_MOD, this.serviceObj.title,
              globalsConstants.K_ALL_USERS);
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
      this.editService.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  onActiveService(service: ServiceInterface){
    let auxActive = 0;
    if(1 == service.active){
      this.alertActiveStr = K_DEACTIVE_SERVICE;
      this.actionActiveStr = K_DEACTIVE_STR;
      this.actionTextActiveStr = K_DEACTIVE_SUCCESS_SRT;
      auxActive = 1;
    }
    else{
      this.alertActiveStr = K_ACTIVE_SERVICE;
      this.actionActiveStr = K_ACTIVE_STR;
      this.actionTextActiveStr = K_ACTIVE_SUCCESS_SRT;
      auxActive = 0;
    }

    Swal.fire({
      title: this.alertActiveStr,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_OK_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        service.user_id = this.globals.userID;
        // Posibilidad de nuevo servicio en data-api.service para activar/desactivar
        service.active = (service.active == 0) ? 1 : 0;  // Así no tener que hace esto
        this.dataApi.updateServiceById(service).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            service.active = auxActive;
            this.getServicesByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              this.actionActiveStr,
              this.actionTextActiveStr,
              'success'
            )
            if(!service.active){
              this.coreService.createNotification(
                globalsConstants.K_MOD_SERVICE ,globalsConstants.K_ACTIVE_MOD, service.title,
                globalsConstants.K_ALL_USERS);
            }
            else{
              this.coreService.createNotification(
                globalsConstants.K_MOD_SERVICE ,globalsConstants.K_DEACTIVE_MOD, service.title,
                globalsConstants.K_ALL_USERS);
            }
          } else{
            service.active = auxActive;
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
