import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Globals } from 'src/app/common/globals';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { UserInterface } from 'src/app/models/user-interface';
import { RolInterface } from 'src/app/models/rol-interface';

// Constants
const K_DELETE_USER = '¿Seguro que deseas eliminar al usuario?';
const K_WARNING_ACTION = 'Atención: Esta acción no se puede deshacer.';
const K_DEACTIVE_USER = '¿Seguro que deseas desactivar este usuario?';
const K_ACTIVE_USER = '¿Seguro que deseas activar este usuario?';
const K_DEACTIVE_STR = '¡Desactivado!';
const K_ACTIVE_STR = '¡Activado!';
const K_DEACTIVE_SUCCESS_SRT = 'Se ha desactivado el usuario.';
const K_ACTIVE_SUCCESS_SRT = 'Se ha activado el usuario.';

@Component({
  selector: 'app-usermgt',
  templateUrl: './usermgt.component.html',
  styleUrls: ['./usermgt.component.css']
})
export class UsermgtComponent implements OnInit {

  // Path
  path = environment.imageRootPath;
  // User
  userObj: UserInterface;
  users: UserInterface[] = [];
  // Utils
  globals: Globals;
  alertLockStr = "";
  actionLockStr = "";
  actionTextLockStr = "";
  // Role
  userRol : RolInterface;
  roles: RolInterface[] = [];
  // Errors
  errors = "";
  // Number pages
  public numberPage: number[] = [];
  // Current page
  public page: number = 1;
  // Total pages
  public totalPages: number = 0;
  // Total de elementos
  public numUsers: number = 0;
  // Elements by pages
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editUser", { static: false }) editUser: ElementRef;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  // User in session
  userInSession = "";
  // Load
  isLoaded: boolean;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.userObj = new UserInterface();
    this.element.scrollTop = 0;
    this.userInSession = localStorage.getItem('email');
    this.getAllRoles();
  }

  ngOnInit() {
    this.isLoaded = false;
    this.activeForm = false;
    this.isEditForm = false;
    this.getUsersByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getUsersByPage(page);
  }

  getUsersByPage(page: Number) {
    this.dataApi.getUsersByPage(page).subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod){
        this.users = data.allUsers;
        this.numUsers = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else {
        this.numUsers = globalsConstants.K_ZERO_RESULTS;
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  getAllRoles() {
    this.dataApi.getAllRoles().subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod){
        this.roles = data.allRoles;
      } else {
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onNewUser() {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = false;

    // Setear valores por defecto
    this.userObj.id = null;
    this.userObj.name = globalsConstants.K_BLANK;;
    this.userObj.surname = globalsConstants.K_BLANK;;
    this.userObj.email = globalsConstants.K_BLANK;;
    this.userObj.telephone = null;
    this.userObj.address = globalsConstants.K_BLANK;;
    this.userObj.zipcode = null;
    this.userObj.city = globalsConstants.K_BLANK;;
    this.userObj.province = globalsConstants.K_BLANK;;

    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditUser(user: UserInterface) {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = true;

    // Setear valores al ui
    this.userObj.id = user.id;
    this.userObj.name = user.name;
    this.userObj.surname = user.surname;
    this.userObj.email = user.email;
    this.userObj.telephone = user.telephone;
    this.userObj.address = user.address;
    this.userObj.city = user.city;
    this.userObj.province = user.province;
    this.userObj.zipcode = user.zipcode;
    this.userObj.rol_id = user.rol_id;
    // Buscamos el objeto rol según un identificador
    this.userRol = this.roles.find(e => e.id === user.rol_id);

    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteUser(user: UserInterface){
    Swal.fire({
      title: K_DELETE_USER,
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
        this.dataApi.deleteUserById(user.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getUsersByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_DELETE_EXC_STR,
              data.message,
              'success'
            )
          } else {
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

  onLockUser(user: UserInterface){
    let auxActive = 0;
    if(1 == user.active){
      this.alertLockStr = K_DEACTIVE_USER;
      this.actionLockStr = K_DEACTIVE_STR;
      this.actionTextLockStr = K_DEACTIVE_SUCCESS_SRT;
      auxActive = 1;
    }
    else{
      this.alertLockStr = K_ACTIVE_USER;
      this.actionLockStr = K_ACTIVE_STR;
      this.actionTextLockStr = K_ACTIVE_SUCCESS_SRT;
      auxActive = 0;
    }

    Swal.fire({
      title: this.alertLockStr,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_OK_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        user.active = (user.active == 0) ? 1 : 0;
        this.dataApi.updateUserById(user).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            user.active = auxActive;
            this.getUsersByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              this.actionLockStr,
              this.actionTextLockStr,
              'success'
            )
          } else {
            user.active = auxActive;
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

  onSubmit(form: NgForm){
    this.isLoaded = false;
    if(this.isEditForm){
      this.userObj.rol_id = this.userRol.id;
      this.dataApi.updateUserById(this.userObj).subscribe((data) => {
        if (globalsConstants.K_COD_OK == data.cod){
          this.getUsersByPage(this.page);
          this.onCancel();
          this.isLoaded = true;
          this.toastr.success(data.message, globalsConstants.K_UPDATE_STR);
        } else{
          this.isLoaded = true;
          this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
        }
      });
    } else{
      this.userObj.rol_id = this.userRol.id;
      this.dataApi.createUser(this.userObj).subscribe((data) => {
        if (globalsConstants.K_COD_OK == data.cod){
          this.getUsersByPage(this.page);
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

  onCancel(){
    this.isEditForm = false;
    this.activeForm = false;
  }

  scrollToForm() {
      this.editUser.nativeElement.scrollIntoView({behavior:"smooth"});
  }

}
