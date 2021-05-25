import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { WorkshopInterface } from 'src/app/models/workshop-interface';

// Constants
const K_DELETE_WORKSHOP = '¿Seguro que deseas eliminar el taller?';
const K_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
const K_WARNING_ACTION = 'Atención: Esta acción no se puede deshacer.';
const K_DEACTIVE_WORKSHOP = '¿Seguro que deseas desactivar este taller?';
const K_ACTIVE_WORKSHOP = '¿Seguro que deseas activar este taller?';
const K_DEACTIVE_STR = '¡Desactivado!';
const K_ACTIVE_STR = '¡Activado!';
const K_DEACTIVE_SUCCESS_SRT = 'Se ha desactivado el taller.';
const K_ACTIVE_SUCCESS_SRT = 'Se ha activado el taller.';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {

  // Path
  path = environment.imageRootPath;
  // Workshops
  workShopObj: WorkshopInterface;
  workShops: WorkshopInterface[] = [];
  workshopImg: string;
  inHomeChk: boolean;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Workshops - Image
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
  public numWorkShops: number;
  // Elementos por página
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editWorkshop", { static: false }) editWorkshop: ElementRef;
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

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.workShopObj = new WorkshopInterface();
    this.inHomeChk = false;
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.isLoaded = false;
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.getWorkShopsByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getWorkShopsByPage(page);
  }

  getWorkShopsByPage(page: Number) {
    this.dataApi.getWorkShopsByPage(page).subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod){
        this.workShops = data.allWorkshops;
        this.numWorkShops = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else{
        this.numWorkShops = globalsConstants.K_ZERO_RESULTS;
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onReload(){
    this.getWorkShopsByPage(this.page);
  }

  onNewWorkshop() {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.workShopObj.id = null;
    this.workShopObj.home = 0;
    this.inHomeChk = false;
    this.workShopObj.title = globalsConstants.K_BLANK;;
    this.workShopObj.description_home = globalsConstants.K_BLANK;;
    this.workShopObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.workShopObj.subtitle = globalsConstants.K_BLANK;;
    this.workShopObj.price = 0;
    this.workShopObj.address = globalsConstants.K_BLANK;;
    this.workShopObj.session_date = globalsConstants.K_BLANK;;
    this.workShopObj.session_start = globalsConstants.K_BLANK;;
    this.workShopObj.session_end = globalsConstants.K_BLANK;;
    this.workShopObj.sessions = 0;
    this.workShopObj.description = globalsConstants.K_BLANK;;
    this.workShopObj.user_id = 1;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditWorkshop(workShop: WorkshopInterface) {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    // Setear valores al ui
    this.workShopObj.id = workShop.id;
    this.workShopObj.home = workShop.home;
    this.inHomeChk = (workShop.home == 1) ? true : false;
    this.workShopObj.title = workShop.title;
    this.workShopObj.description_home = workShop.description_home;
    this.workShopObj.image = (workShop.image) ? workShop.image : globalsConstants.K_DEFAULT_IMAGE;;
    this.workShopObj.subtitle = workShop.subtitle;
    this.workShopObj.price = workShop.price;
    this.workShopObj.address = workShop.address;
    this.workShopObj.session_date = workShop.session_date;
    this.workShopObj.session_start = workShop.session_start;
    this.workShopObj.session_end = workShop.session_end;
    this.workShopObj.sessions = workShop.sessions;
    this.workShopObj.description = workShop.description;
    this.workShopObj.user_id = workShop.user_id;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteWorkshop(workShop: WorkshopInterface){
    Swal.fire({
      title: K_DELETE_WORKSHOP,
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
        this.dataApi.deleteWorkshopById(workShop.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getWorkShopsByPage(this.page);
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
    if(globalsConstants.K_DEFAULT_IMAGE != this.workShopObj.image){
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
          this.workShopObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getWorkShopsByPage(this.page);
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
          this.workshopImg = img['message'];
          this.workShopObj.image = this.workshopImg;
          this.uploadSuccess = false;
          this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getWorkShopsByPage(this.page);
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
        this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getWorkShopsByPage(this.page);
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
          this.workshopImg = img['message'];
          this.workShopObj.image = this.workshopImg;
          this.uploadSuccess = false;
          this.dataApi.createWorkshop(this.workShopObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getWorkShopsByPage(this.page);
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
        this.dataApi.createWorkshop(this.workShopObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getWorkShopsByPage(this.page);
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
      this.editWorkshop.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  toggleVisibility(e){
    this.workShopObj.home = (this.inHomeChk) ? 1 : 0;
  }

  onActiveWorkshop(workshop: WorkshopInterface){
    let auxActive = 0;
    if(1 == workshop.active){
      this.alertActiveStr = K_DEACTIVE_WORKSHOP;
      this.actionActiveStr = K_DEACTIVE_STR;
      this.actionTextActiveStr = K_DEACTIVE_SUCCESS_SRT;
      auxActive = 1;
    }
    else{
      this.alertActiveStr = K_ACTIVE_WORKSHOP;
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
        // Posibilidad de nuevo servicio en data-api.service para activar/desactivar
        workshop.active = (workshop.active == 0) ? 1 : 0; // Así no tener que hace esto
        this.dataApi.updateWorkshopById(workshop).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            workshop.active = auxActive;
            this.getWorkShopsByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              this.actionActiveStr,
              this.actionTextActiveStr,
              'success'
            )
          } else{
            workshop.active = auxActive;
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
