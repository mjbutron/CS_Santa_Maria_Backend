import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  // Errors
  errors = "";
  // Form
  activeForm = false;
  activeFormPass = false;
  disabledForm = true;
  disabledFormPass = true;
  // Pass
  currentPass = "";
  newPass = "";
  repetNewPass = "";

  element;

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

  onCancelEditPass() {
    this.activeFormPass = false;
    this.disabledFormPass = true;
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

  onSubmitPass(form: NgForm){
    console.log(form);

    if(form.invalid){
      return;
    }

  }

}
