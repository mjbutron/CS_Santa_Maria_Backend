import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { AboutUsInterface } from 'src/app/models/aboutus-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  // Path
  path = "http://localhost/apiRest/uploads/";
  // AboutUs
  aboutUsObj: AboutUsInterface;
  aboutUs: AboutUsInterface[] = [];
  aboutUsImg: string;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // AboutUs - Image
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
  public numAboutUs: number;
  // Elementos por página
  private numResults: number = 10;
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
  // Scroll Form
  @ViewChild("editAboutUs", { static: false }) editAboutUs: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;
  // Load
  isLoaded: boolean;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.aboutUsObj = new AboutUsInterface();
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.isLoaded = false;
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.getAboutUsByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getAboutUsByPage(page);
  }

  getAboutUsByPage(page: Number) {
    this.dataApi.getAboutUsByPage(page).subscribe((data) =>{
        this.aboutUs = data['allAboutUs'];
        this.numAboutUs = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        // Temporal - comprobar carga de datos y reintentos
        setTimeout (() => {
             this.isLoaded = true;
          }, 1000);
      }, (err) => {
        this.isLoaded = false;
        this.errors = err;
      });
  }

  onNewAboutUs() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.aboutUsObj.name = K_BLANK;
    this.aboutUsObj.surname1 = K_BLANK;
    this.aboutUsObj.surname2 = K_BLANK;
    this.aboutUsObj.image = "default_image.jpg";
    this.aboutUsObj.position = K_BLANK;
    this.aboutUsObj.description = K_BLANK;
    this.aboutUsObj.academic_degree = K_BLANK;
    this.aboutUsObj.user_fcbk = K_BLANK;
    this.aboutUsObj.user_ytube = K_BLANK;
    this.aboutUsObj.user_insta = K_BLANK;
    this.aboutUsObj.user_id = 1;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditAboutUs(aboutUs: AboutUsInterface) {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    // Setear valores al ui
    this.aboutUsObj.id = aboutUs.id;
    this.aboutUsObj.name = aboutUs.name;
    this.aboutUsObj.surname1 = aboutUs.surname1;
    this.aboutUsObj.surname2 = aboutUs.surname2;
    this.aboutUsObj.image = (aboutUs.image) ? aboutUs.image : "default_image.jpg";
    this.aboutUsObj.position = aboutUs.position;
    this.aboutUsObj.description = aboutUs.description;
    this.aboutUsObj.academic_degree = aboutUs.academic_degree;
    this.aboutUsObj.user_fcbk = aboutUs.user_fcbk;
    this.aboutUsObj.user_ytube = aboutUs.user_ytube;
    this.aboutUsObj.user_insta = aboutUs.user_insta;
    this.aboutUsObj.user_id = aboutUs.user_id;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteAboutUs(aboutUs: AboutUsInterface){
    Swal.fire({
      title: '¿Seguro que deseas eliminar la entrada?',
      text: "Atención: Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0095A6',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.dataApi.deleteAboutUsId(aboutUs.id).subscribe((data) => {
          this.getAboutUsByPage(this.page);
          this.isEditForm = false;
          this.activeForm = false;
          this.uploadSuccess = false;
          this.changeImage = false;
          Swal.fire(
            '¡Eliminado!',
            'Se ha eliminado la entrada seleccionada.',
            'success'
          )
        }, (err) => {
          Swal.fire(
            '¡Error!',
            'No se ha podido eliminar la entrada.',
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
          this.aboutUsImg = img['message'];
          this.aboutUsObj.image = this.aboutUsImg;
          this.uploadSuccess = false;
          this.dataApi.updateAboutUsById(this.aboutUsObj).subscribe((data) => {
            this.getAboutUsByPage(this.page);
            this.toastr.success('Se ha actualizado la entrada', 'Actualizada');
          });
        });
      } else{
        this.dataApi.updateAboutUsById(this.aboutUsObj).subscribe((data) => {
          this.getAboutUsByPage(this.page);
          this.toastr.success('Se ha actualizado la entrada', 'Actualizada');
        });
      }
    } else{
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.aboutUsImg = img['message'];
          this.aboutUsObj.image = this.aboutUsImg;
          this.uploadSuccess = false;
          this.dataApi.createAboutUs(this.aboutUsObj).subscribe((data) => {
            this.getAboutUsByPage(this.page);
            this.toastr.success('Se ha creado una nueva entrada', 'Añadida');
          });
        });
      } else{
        this.dataApi.createAboutUs(this.aboutUsObj).subscribe((data) => {
          this.getAboutUsByPage(this.page);
          this.toastr.success('Se ha creado una nueva entrada', 'Añadida');
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

  scrollToForm() {
      this.editAboutUs.nativeElement.scrollIntoView({behavior:"smooth"});
  }
}
