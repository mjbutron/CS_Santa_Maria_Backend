import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Globals } from 'src/app/common/globals';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { UserInterface } from 'src/app/models/user-interface';
import { RolInterface } from 'src/app/models/rol-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;
const K_NUM_ZERO = 0;
const K_COD_OK = 200;

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
  private numResults: number = 10;
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
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
      if (K_COD_OK == data.cod){
        this.users = data['allUsers'];
        this.numUsers = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else {
        this.numUsers = K_NUM_ZERO;
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido cargar los datos.', 'Error');
      }
    });
  }

  getAllRoles() {
    this.dataApi.getAllRoles().subscribe((data) =>{
      if (K_COD_OK == data.cod){
        this.roles = data['allRoles'];
      } else {
        this.toastr.error('Error interno. No se ha podido cargar los datos.', 'Error');
      }
    });
  }

  onNewUser() {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = false;

    // Setear valores por defecto
    this.userObj.name = K_BLANK;
    this.userObj.surname = K_BLANK;
    this.userObj.email = K_BLANK;
    this.userObj.telephone = null;
    this.userObj.address = K_BLANK;
    this.userObj.zipcode = null;
    this.userObj.city = K_BLANK;
    this.userObj.province = K_BLANK;

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
      title: '¿Seguro que deseas eliminar el usuario?',
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
        this.dataApi.deleteUserById(user.id).subscribe((data) => {
          if (K_COD_OK == data.cod){
            this.getUsersByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              '¡Eliminado!',
              'Se ha eliminado el usuario seleccionado.',
              'success'
            )
          } else {
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

  onLockUser(user: UserInterface){
    let auxActive = 0;
    if(1 == user.active){
      this.alertLockStr = "¿Seguro que deseas desactivar este usuario?";
      this.actionLockStr = "¡Desactivado!";
      this.actionTextLockStr = "Se ha desactivado el usuario.";
      auxActive = 1;
    }
    else{
      this.alertLockStr = "¿Seguro que deseas activar este usuario?";
      this.actionLockStr = "¡Activado!";
      this.actionTextLockStr = "Se ha activado el usuario.";
      auxActive = 0;
    }

    Swal.fire({
      title: this.alertLockStr,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0095A6',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        user.active = (user.active == 0) ? 1 : 0;
        this.dataApi.updateUserById(user).subscribe((data) => {
          if (K_COD_OK == data.cod){
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
              '¡Error!',
              'Error interno. No se ha podido realizar la acción.',
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
        if (K_COD_OK == data.cod){
          this.getUsersByPage(this.page);
          this.onCancel();
          this.isLoaded = true;
          this.toastr.success('Se ha actualizado el usuario', 'Actualizado');
        } else{
          this.isLoaded = true;
          this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
        }
      });
    } else{
      this.userObj.rol_id = this.userRol.id;
      this.dataApi.createUser(this.userObj).subscribe((data) => {
        if (K_COD_OK == data.cod){
          this.getUsersByPage(this.page);
          this.onCancel();
          this.isLoaded = true;
          this.toastr.success('Se ha creado un nuevo usuario', 'Añadido');
        } else{
          this.isLoaded = true;
          this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
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
