import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { UserInterface } from 'src/app/models/user-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;
const K_COD_OK = 200;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // Path
  path = environment.imageRootPath;
  // User Obj
  userObj: UserInterface;
  // Utils
  globals: Globals;
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
  // Scroll Social Form
  @ViewChild("editSocial", { static: false }) editSocial: ElementRef;
  // Scroll Image Form
  @ViewChild("editImage", { static: false }) editImage: ElementRef;
  // Errors
  errors = "";
  // Form
  activeForm = false;
  activeFormPass = false;
  activeFormSocial = false;
  disabledForm = true;
  disabledFormPass = true;
  disabledFormSocial = true;
  // User - Image
  selectedImg: File;
  userImg: string;
  uploadSuccess: boolean;
  activeFormImage: boolean;
  disabledFormImage: boolean;
  progress: number = 0;
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Pass
  currentPass = "";
  errorCurrentPass = "";
  newPass = "";
  errorNewPass = "";
  repetNewPass = "";
  errorRepetNewPass = "";
  // Load
  isLoaded: boolean;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, globals: Globals, private coreService: CoreService) {
    this.userObj = new UserInterface();
    this.globals = globals;
    this.element.scrollTop = 0;
    this.setGlobalsData();
  }

  ngOnInit() {
    this.activeFormImage = false;
    this.disabledFormImage = true;
    this.uploadSuccess = false;
    this.getUserProfile();
  }

  setGlobalsData(){
    this.globals.user = localStorage.getItem('username');
    this.globals.rol = localStorage.getItem('rolname');
    this.globals.userImage = localStorage.getItem('userImage');
  }

  getUserProfile() {
    this.isLoaded = false;
    this.userObj.email = localStorage.getItem('email');
    this.dataApi.getUserProfile(this.userObj).subscribe((data) =>{
      if (K_COD_OK == data.cod){
        this.userObj = data.user;
        this.userObj.image = (data.user.image) ? data.user.image : "default-avatar.png";
        this.isLoaded = true;
      }
      else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
      }
    });
  }

  onEditUser() {
    this.disabledForm = false;
    this.activeForm = true;
  }

  onCancelEdit() {
    this.getUserProfile();
    this.activeForm = false;
    this.disabledForm = true;
  }

  onEditPassword() {
    this.disabledFormPass = false;
    this.activeFormPass = true;
  }

  onCancelEditPass(form: NgForm) {
    this.activeFormPass = false;
    this.disabledFormPass = true;
    form.reset();
  }

  onEditSocial() {
    this.disabledFormSocial = false;
    this.activeFormSocial = true;
  }

  onCancelEditSocial() {
    this.getUserProfile();
    this.activeFormSocial = false;
    this.disabledFormSocial = true;
  }

  onEditImage(){
    this.disabledFormImage = false;
    this.activeFormImage = true;
  }

  onCancelEditImage(){
    this.activeFormImage = false;
    this.disabledFormImage = true;
    this.uploadSuccess = false;
  }

  onSubmitUser(form: NgForm){
    this.isLoaded = false;
    if(form.invalid){
      this.isLoaded = true;
      return;
    }
    this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
      if (K_COD_OK == data.cod){
        localStorage.setItem('username', this.userObj.name);
        this.setGlobalsData();
        this.activeForm = false;
        this.disabledForm = true;
        this.isLoaded = true;
        this.toastr.success('Se ha actualizado la información', 'Actualizado');
      }
      else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
      }
    });
  }

  onSubmitImage(form: NgForm){
    this.isLoaded = false;
    if(this.activeFormImage && this.selectedImg != null){
      this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
        this.userImg = img['message'];
        this.userObj.image = this.userImg;
        this.uploadSuccess = false;
        this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
          if (K_COD_OK == data.cod){
            localStorage.setItem('userImage', this.userObj.image);
            this.setGlobalsData();
            this.getUserProfile();
            this.isLoaded = true;
            this.toastr.success('Se ha actualizado su imagen', 'Actualizado');
          }
          else{
            this.isLoaded = true;
            this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
          }
        });
      });
    }
  }

  onSubmitSocial(form: NgForm){
    this.isLoaded = false;
    if(form.invalid){
      this.isLoaded = true;
      return;
    }
    this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
      if (K_COD_OK == data.cod){
        this.activeFormSocial = false;
        this.disabledFormSocial = true;
        this.isLoaded = true;
        this.toastr.success('Se ha actualizado la información', 'Actualizado');
      }
      else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
      }
    });
  }

  onSubmitPass(form: NgForm){
    if(form.invalid){
      return;
    } else if(this.currentPass == this.newPass){
      Swal.fire({
        icon: 'error',
        text: '¡La nueva contraseña es igual a la anterior!'
      });
      return;
    } else if(this.newPass != this.repetNewPass){
      Swal.fire({
        icon: 'error',
        text: '¡Las contraseñas no coinciden!'
      });
      return;
    }
    this.isLoaded = false;
    this.dataApi.checkPassword(this.userObj, this.currentPass).subscribe((data) => {
      if (K_COD_OK == data.cod){
        if(data['check']){
          this.dataApi.updatePassword(this.userObj, this.newPass).subscribe((data) => {
            if (K_COD_OK == data.cod){
              this.globals.isChangePass = true;
              this.onCancelEditPass(form);
              this.isLoaded = true;
              this.toastr.success('Se ha actualizado la contraseña', 'Actualizado');
            }
            else{
              this.isLoaded = true;
              this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
            }
          });
        }
        else{
         Swal.fire({
           icon: 'error',
           text: '¡La contraseña actual es incorrecta!'
         });
         return;
       }
      }
      else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
      }
    });
  }

  scrollToForm() {
      this.editSocial.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  goToLink(url: string){
    console.log(url);
    window.open(url, "_blank");
  }

  scrollToChangeImage(){
    this.editImage.nativeElement.scrollIntoView({behavior:"smooth"});
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
              this.progress = i; // Simulación progreso
          }, 500);
        }
        this.uploadSuccess = true;
        setTimeout(() => {
            this.progress = 0;
        }, 2500);
      }
    } else{
      return;
    }
  }
}
