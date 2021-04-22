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
    this.isLoaded = false;
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
    this.userObj.email = localStorage.getItem('email');
    this.dataApi.getUserProfile(this.userObj).subscribe((data) =>{
      this.userObj.id = data['id'];
      this.userObj.active = data['active'];
      this.userObj.name = data['name'];
      this.userObj.surname = data['surname'];
      this.userObj.telephone = data['telephone'];
      this.userObj.address = data['address'];
      this.userObj.city = data['city'];
      this.userObj.province = data['province'];
      this.userObj.zipcode = data['zipcode'];
      this.userObj.aboutme = data['aboutme'];
      this.userObj.password = data['password'];
      this.userObj.userFcbk = data['user_fcbk'];
      this.userObj.userYtube = data['user_ytube'];
      this.userObj.userInsta = data['user_insta'];
      this.userObj.image = (data['image']) ? data['image'] : "default-avatar.png";
      this.userObj.lastLogin = data['last_login'];
      // Temporal - comprobar carga de datos y reintentos
      setTimeout (() => {
           this.isLoaded = true;
        }, 1000);
    }, (err) => {
      this.isLoaded = false;
      this.errors = err;
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
    if(form.invalid){
      return;
    }
    this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
      this.toastr.success('Se ha actualizado la información', 'Actualizado');
      localStorage.setItem('username', this.userObj.name);
      this.setGlobalsData();
      this.activeForm = false;
      this.disabledForm = true;
    }, (err) => {
      this.toastr.error('No se ha podido actualizar la información', 'Error');
    });
  }

  onSubmitImage(form: NgForm){
    if(this.activeFormImage && this.selectedImg != null){
      this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
        this.userImg = img['message'];
        this.userObj.image = this.userImg;
        this.uploadSuccess = false;
        this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
          localStorage.setItem('userImage', this.userObj.image);
          this.setGlobalsData();
          this.getUserProfile();
          this.toastr.success('Se ha actualizado su imagen', 'Actualizado');
        });
      });
    }
  }

  onSubmitSocial(form: NgForm){
    console.log(form);

    if(form.invalid){
      return;
    }
    this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
      this.toastr.success('Se ha actualizado la información', 'Actualizado');
      this.activeFormSocial = false;
      this.disabledFormSocial = true;
    }, (err) => {
      this.toastr.error('No se ha podido actualizar la información', 'Ups!');
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

    this.dataApi.checkPassword(this.userObj, this.currentPass).subscribe((data) => {
        if(data['check']){
          this.dataApi.updatePassword(this.userObj, this.newPass).subscribe((data) => {
            this.toastr.success('Se ha actualizado la contraseña', 'Actualizado');
            this.globals.isChangePass = true;
            this.onCancelEditPass(form);
          }, (err) => {
            this.errors = err;
            this.toastr.error('No se ha podido actualizar la contraseña', 'Ups!');
          });
        } else{
          Swal.fire({
            icon: 'error',
            text: '¡La contraseña actual es incorrecta!'
          });
          return;
        }
    }, (err) => {
      this.errors = err;
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
