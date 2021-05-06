import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { WorkshopInterface } from 'src/app/models/workshop-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;
const K_NUM_ZERO = 0;
const K_COD_OK = 200;
const K_DEFAULT_IMAGE = 'default_image.jpg';

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
  private numResults: number = 10;
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
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
      if (K_COD_OK == data.cod){
        this.workShops = data['allWorkshops'];
        this.numWorkShops = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else{
        this.numWorkShops = K_NUM_ZERO;
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido cargar los datos.', 'Error');
      }
    });
  }

  onNewWorkshop() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;
    this.workShopObj.home = 0;
    this.inHomeChk = false;
    this.workShopObj.title = K_BLANK;
    this.workShopObj.description_home = K_BLANK;
    this.workShopObj.image = "default_image.jpg";
    this.workShopObj.subtitle = K_BLANK;
    this.workShopObj.price = 0;
    this.workShopObj.address = K_BLANK;
    this.workShopObj.session_date = K_BLANK;
    this.workShopObj.session_start = K_BLANK;
    this.workShopObj.session_end = K_BLANK;
    this.workShopObj.sessions = 0;
    this.workShopObj.description = K_BLANK;
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
    this.workShopObj.image = (workShop.image) ? workShop.image : "default_image.jpg";
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
      title: '¿Seguro que deseas eliminar el taller?',
      text: "Atención: Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0095A6',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        this.dataApi.deleteWorkshopById(workShop.id).subscribe((data) => {
          if (K_COD_OK == data.cod){
            this.getWorkShopsByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.uploadSuccess = false;
            this.changeImage = false;
            this.isLoaded = true;
            Swal.fire(
              '¡Eliminado!',
              'Se ha eliminado el taller seleccionado.',
              'success'
            )
          } else{
            this.isLoaded = true;
            Swal.fire(
              '¡Error!',
              'Error interno. No se ha podido realizar la acción.',
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
    if(K_DEFAULT_IMAGE != this.workShopObj.image){
      Swal.fire({
        title: '¿Seguro que deseas eliminar la imagen?',
        text: "Atención: Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#0095A6',
        confirmButtonText: '¡Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.value) {
          this.isLoaded = false;
          this.workShopObj.image = "default_image.jpg";
          this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
            if (K_COD_OK == data.cod){
              this.getWorkShopsByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              Swal.fire(
                '¡Eliminada!',
                'Se ha eliminado la imagen.',
                'success'
              )
            }
            else{
              this.isLoaded = true;
              Swal.fire(
                '¡Error!',
                'Error interno. No se ha podido realizar la acción.',
                'error'
              )
            }
          });
        }
      });
    }
    else {
      this.toastr.info("No existe imagen", 'Información');
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
            if (K_COD_OK == data.cod){
              this.getWorkShopsByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success('Se ha actualizado el taller', 'Actualizado');
            } else{
              this.isLoaded = true;
              this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
            }
          });
        });
      } else{
        this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
          if (K_COD_OK == data.cod){
            this.getWorkShopsByPage(this.page);
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success('Se ha actualizado el taller', 'Actualizado');
          } else{
            this.isLoaded = true;
            this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
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
            if (K_COD_OK == data.cod){
              this.getWorkShopsByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success('Se ha creado un nuevo taller', 'Añadido');
            } else{
              this.isLoaded = true;
              this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
            }
          });
        });
      } else{
        this.dataApi.createWorkshop(this.workShopObj).subscribe((data) => {
          if (K_COD_OK == data.cod){
            this.getWorkShopsByPage(this.page);
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success('Se ha creado un nuevo taller', 'Añadido');
          } else{
            this.isLoaded = true;
            this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
          }
        });
      }
    }
  }

  onFileChanged($event){
    if($event != null){
      this.selectedImg = $event.target.files[0];
      if(this.selectedImg.size > K_MAX_SIZE){
        this.imageFile.nativeElement.value = K_BLANK;
        this.toastr.error('El tamaño no puede ser superior a 3MB.', 'Error');
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
      this.alertActiveStr = "¿Seguro que deseas desactivar este taller?";
      this.actionActiveStr = "¡Desactivado!";
      this.actionTextActiveStr = "Se ha desactivado el taller.";
      auxActive = 1;
    }
    else{
      this.alertActiveStr = "¿Seguro que deseas activar este taller?";
      this.actionActiveStr = "¡Activado!";
      this.actionTextActiveStr = "Se ha activado el taller.";
      auxActive = 0;
    }

    Swal.fire({
      title: this.alertActiveStr,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0095A6',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        // Posibilidad de nuevo servicio en data-api.service para activar/desactivar
        workshop.active = (workshop.active == 0) ? 1 : 0; // Así no tener que hace esto
        this.dataApi.updateWorkshopById(workshop).subscribe((data) => {
          if (K_COD_OK == data.cod){
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
              '¡Error!',
              'Error interno. No se ha podido realizar la acción.',
              'error'
            )
          }
        });
      }
    });
  }
}
