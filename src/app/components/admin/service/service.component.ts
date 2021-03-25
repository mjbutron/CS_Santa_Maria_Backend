import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { ServiceInterface } from 'src/app/models/service-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;
const K_NUM_ZERO = 0;
const K_COD_OK = 200;

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  // Path
  path = "http://localhost/apiRest/uploads/";
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
  // Errors
  errors = "";
  // Numeros páginas
  public numberPage: number[] = [];
  // Página actual
  public page: number = 1;
  // Total de paginas
  public totalPages: number;
  // Total de elementos
  public numServices: number;
  // Elementos por página
  private numResults: number = 10;
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
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

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
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
      if (K_COD_OK == data.cod){
        this.services = data['allServices'];
        this.numServices = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else{
        this.numServices = K_NUM_ZERO;
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido cargar los datos.', 'Error');
      }
    });
  }

  onNewService() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.serviceObj.title = K_BLANK;
    this.serviceObj.image = "default_image.jpg";
    this.serviceObj.subtitle = K_BLANK;
    this.serviceObj.description = K_BLANK;
    this.serviceObj.user_id = 1;
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
    // Setear valores al ui
    this.serviceObj.id = service.id;
    this.serviceObj.title = service.title;
    this.serviceObj.image = (service.image) ? service.image : "default_image.jpg";
    this.serviceObj.subtitle = service.subtitle;
    this.serviceObj.description = service.description;
    this.serviceObj.user_id = service.user_id;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteService(service: ServiceInterface){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el servicio?',
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
        this.dataApi.deleteServiceById(service.id).subscribe((res) => {
          if (K_COD_OK == res.cod){
            this.getServicesByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.uploadSuccess = false;
            this.changeImage = false;
            this.isLoaded = true;
            Swal.fire(
              '¡Eliminado!',
              'Se ha eliminado el servicio seleccionado.',
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

  onSubmit(form: NgForm){
    this.isLoaded = false;
    if(this.isEditForm){
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.serviceImg = img['message'];
          this.serviceObj.image = this.serviceImg;
          this.uploadSuccess = false;
          this.dataApi.updateServiceById(this.serviceObj).subscribe((res) => {
            if (K_COD_OK == res.cod){
              this.getServicesByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success('Se ha actualizado el servicio.', 'Actualizado');
            } else{
              this.isLoaded = true;
              this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
            }
          });
        });
      } else{
        this.dataApi.updateServiceById(this.serviceObj).subscribe((res) => {
          if (K_COD_OK == res.cod){
            this.getServicesByPage(this.page);
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success('Se ha actualizado el servicio.', 'Actualizado');
          } else{
            this.isLoaded = true;
            this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
          }
        });
      }
    } else{
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.serviceImg = img['message'];
          this.serviceObj.image = this.serviceImg;
          this.uploadSuccess = false;
          this.dataApi.createService(this.serviceObj).subscribe((res) => {
            if (K_COD_OK == res.cod){
              this.getServicesByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success('Se ha creado un nuevo servicio', 'Añadido');
            } else{
              this.isLoaded = true;
              this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
            }
          });
        });
      } else{
        this.dataApi.createService(this.serviceObj).subscribe((res) => {
          if (K_COD_OK == res.cod){
            this.getServicesByPage(this.page);
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success('Se ha creado un nuevo servicio', 'Añadido');
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
      this.editService.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  onActiveService(service: ServiceInterface){
    let auxActive = 0;
    if(1 == service.active){
      this.alertActiveStr = "¿Seguro que deseas desactivar este servicio?";
      this.actionActiveStr = "¡Desactivado!";
      this.actionTextActiveStr = "Se ha desactivado el servicio.";
      auxActive = 1;
    }
    else{
      this.alertActiveStr = "¿Seguro que deseas activar este servicio?";
      this.actionActiveStr = "¡Activado!";
      this.actionTextActiveStr = "Se ha activado el servicio.";
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
        service.active = (service.active == 0) ? 1 : 0;  // Así no tener que hace esto
        this.dataApi.updateServiceById(service).subscribe((res) => {
          if (K_COD_OK == res.cod){
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
          } else{
            service.active = auxActive;
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
