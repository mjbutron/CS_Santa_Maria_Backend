import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';

import { DataApiService } from 'src/app/services/data-api.service';
import { UserInterface } from 'src/app/models/user-interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // User Obj
  userObj: UserInterface;
  // Utils
  globals: Globals;
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
  // Scroll Social Form
  @ViewChild("editSocial", { static: true }) editSocial: ElementRef;
  // Errors
  errors = "";
  // Form
  activeForm = false;
  activeFormPass = false;
  activeFormSocial = false;
  disabledForm = true;
  disabledFormPass = true;
  disabledFormSocial = true;

  // Pass
  currentPass = "";
  errorCurrentPass = "";
  newPass = "";
  errorNewPass = "";
  repetNewPass = "";
  errorRepetNewPass = "";

  constructor(private dataApi: DataApiService, public toastr: ToastrService, globals: Globals) {
    this.userObj = new UserInterface();
    this.globals = globals;
    this.globals.user = localStorage.getItem('username');
    this.globals.rol = localStorage.getItem('rolname');

    this.element.scrollTop = 0;

  }

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.userObj.email = localStorage.getItem('email');
    this.dataApi.getUserProfile(this.userObj).subscribe((data) =>{
      this.userObj.id = data['id'];
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
      this.userObj.lastLogin = data['last_login'];
    }, (err) => {
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

  onSubmitUser(form: NgForm){
    if(form.invalid){
      return;
    }
    this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
      this.toastr.success('Se ha actualizado la información', 'Actualizado');
      localStorage.setItem('username', this.userObj.name);
      this.activeForm = false;
      this.disabledForm = true;
    }, (err) => {
      this.toastr.error('No se ha podido actualizar la información', 'Ups!');
    });
  }

  onSubmitSocial(form: NgForm){
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

}
