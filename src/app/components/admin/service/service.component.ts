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
  @ViewChild("subsScroll", { static: true }) subsScrollDiv: ElementRef;
  // Scroll Form
  @ViewChild("editService", { static: true }) editService: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.serviceObj = new ServiceInterface();
  }

  ngOnInit() {
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.scrollToDiv();
    this.getServicesByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getServicesByPage(page);
  }

  getServicesByPage(page: Number) {
    this.dataApi.getServicesByPage(page).subscribe((data) =>{
        this.services = data['allServices'];
        this.numServices = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
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
        this.dataApi.deleteServiceById(service.id).subscribe((data) => {
          this.getServicesByPage(this.page);
          this.isEditForm = false;
          this.activeForm = false;
          this.uploadSuccess = false;
          this.changeImage = false;
          Swal.fire(
            '¡Eliminado!',
            'Se ha eliminado el servicio seleccionado.',
            'success'
          )
        }, (err) => {
          Swal.fire(
            '¡Error!',
            'No se ha podido eliminar el servicio.',
            'error'
          )
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
    if(this.isEditForm){
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.serviceImg = img['message'];
          this.serviceObj.image = this.serviceImg;
          this.uploadSuccess = false;
          this.dataApi.updateServiceById(this.serviceObj).subscribe((data) => {
            this.getServicesByPage(this.page);
            this.toastr.success('Se ha actualizado el servicio', 'Actualizado');
          });
        });
      } else{
        this.dataApi.updateServiceById(this.serviceObj).subscribe((data) => {
          this.getServicesByPage(this.page);
          this.toastr.success('Se ha actualizado el servicio', 'Actualizado');
        });
      }
    } else{
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.serviceImg = img['message'];
          this.serviceObj.image = this.serviceImg;
          this.uploadSuccess = false;
          this.dataApi.createService(this.serviceObj).subscribe((data) => {
            this.getServicesByPage(this.page);
            this.toastr.success('Se ha creado un nuevo servicio', 'Añadido');
          });
        });
      } else{
        this.dataApi.createService(this.serviceObj).subscribe((data) => {
          this.getServicesByPage(this.page);
          this.toastr.success('Se ha creado un nuevo servicio', 'Añadido');
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
        this.uploadSuccess = true;
      }
    } else{
      return;
    }
  }

  onCancel(form: NgForm){
    form.reset();
    this.isEditForm = false;
    this.activeForm = false;
    this.uploadSuccess = false;
    this.changeImage = false;
  }

  scrollToDiv() {
      this.subsScrollDiv.nativeElement.scrollIntoView(true);
  }

  scrollToForm() {
      this.editService.nativeElement.scrollIntoView({behavior:"smooth"});
  }
}
