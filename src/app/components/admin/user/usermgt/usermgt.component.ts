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

@Component({
  selector: 'app-usermgt',
  templateUrl: './usermgt.component.html',
  styleUrls: ['./usermgt.component.css']
})
export class UsermgtComponent implements OnInit {

  // Path
  path = "http://localhost/apiRest/uploads/";
  // User
  userObj: UserInterface;
  users: UserInterface[] = [];
  userImg: string;
  // Utils
  globals: Globals;
  // Users - Image
  selectedImg: File;
  uploadSuccess: boolean;
  // Role
  userRolId: number = 0;
  roles: RolInterface;
  // Errors
  errors = "";
  // Numeros páginas
  public numberPage: number[] = [];
  // Página actual
  public page: number = 1;
  // Total de paginas
  public totalPages: number = 0;
  // Total de elementos
  public numUsers: number = 0;
  // Elementos por página
  private numResults: number = 10;
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
  // Scroll Form
  @ViewChild("editUser", { static: true }) editUser: ElementRef;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.userObj = new UserInterface();
    this.element.scrollTop = 0;
    this.getAllRoles();
  }

  ngOnInit() {
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.getUsersByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getUsersByPage(page);
  }

  getUsersByPage(page: Number) {
    this.dataApi.getUsersByPage(page).subscribe((data) =>{
        this.users = data['allUsers'];
        this.numUsers = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
    });
  }

  getAllRoles() {
    this.dataApi.getAllRoles().subscribe((allRoles: RolInterface) =>{
        this.roles = allRoles;
    });
  }

  toNumber(){
    
    console.log(this.userRolId);
  }

  onNewUser() {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    // this.serviceObj.title = K_BLANK;
    // this.serviceObj.image = "default_image.jpg";
    // this.serviceObj.subtitle = K_BLANK;
    // this.serviceObj.description = K_BLANK;
    // this.serviceObj.user_id = 1;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditUser(user: UserInterface) {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    // Setear valores al ui
    // this.serviceObj.id = service.id;
    // this.serviceObj.title = service.title;
    // this.serviceObj.image = (service.image) ? service.image : "default_image.jpg";
    // this.serviceObj.subtitle = service.subtitle;
    // this.serviceObj.description = service.description;
    // this.serviceObj.user_id = service.user_id;
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
        this.dataApi.deleteUserById(user.id).subscribe((data) => {
          this.getUsersByPage(this.page);
          this.isEditForm = false;
          this.activeForm = false;
          this.uploadSuccess = false;
          this.changeImage = false;
          Swal.fire(
            '¡Eliminado!',
            'Se ha eliminado el usuario seleccionado.',
            'success'
          )
        }, (err) => {
          Swal.fire(
            '¡Error!',
            'No se ha podido eliminar el usuario.',
            'error'
          )
        });
      }
    });
  }

  onLockUser(user: UserInterface){
    // Swal.fire({
    //   title: '¿Seguro que deseas eliminar el usuario?',
    //   text: "Atención: Esta acción no se puede deshacer.",
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#d33',
    //   cancelButtonColor: '#0095A6',
    //   confirmButtonText: '¡Sí, eliminar!',
    //   cancelButtonText: 'Cancelar'
    // }).then((result) => {
    //   if (result.value) {
    //     this.dataApi.deleteUserById(user.id).subscribe((data) => {
    //       this.getUsersByPage(this.page);
    //       this.isEditForm = false;
    //       this.activeForm = false;
    //       this.uploadSuccess = false;
    //       this.changeImage = false;
    //       Swal.fire(
    //         '¡Eliminado!',
    //         'Se ha eliminado el usuario seleccionado.',
    //         'success'
    //       )
    //     }, (err) => {
    //       Swal.fire(
    //         '¡Error!',
    //         'No se ha podido eliminar el usuario.',
    //         'error'
    //       )
    //     });
    //   }
    // });
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
          this.userImg = img['message'];
          this.userObj.image = this.userImg;
          this.uploadSuccess = false;
          this.dataApi.updateUserById(this.userObj).subscribe((data) => {
            this.getUsersByPage(this.page);
            this.toastr.success('Se ha actualizado el usuario', 'Actualizado');
          });
        });
      } else{
        this.dataApi.updateUserById(this.userObj).subscribe((data) => {
          this.getUsersByPage(this.page);
          this.toastr.success('Se ha actualizado el usuario', 'Actualizado');
        });
      }
    } else{
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.userImg = img['message'];
          this.userObj.image = this.userImg;
          this.uploadSuccess = false;
          this.dataApi.createUser(this.userObj).subscribe((data) => {
            this.getUsersByPage(this.page);
            this.toastr.success('Se ha creado un nuevo usuario', 'Añadido');
          });
        });
      } else{
        this.dataApi.createUser(this.userObj).subscribe((data) => {
          this.getUsersByPage(this.page);
          this.toastr.success('Se ha creado un nuevo usuario', 'Añadido');
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
      this.editUser.nativeElement.scrollIntoView({behavior:"smooth"});
  }

}
