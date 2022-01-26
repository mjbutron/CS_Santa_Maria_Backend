import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Globals } from 'src/app/common/globals';
// Services
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { UserInterface } from 'src/app/models/user-interface';
import { RolInterface } from 'src/app/models/rol-interface';

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
  auxEmail: string;
  // Utils
  globals: Globals;
  alertLockStr = "";
  actionLockStr = "";
  actionTextLockStr = "";
  // Role
  userRol: RolInterface;
  roles: RolInterface[] = [];
  // Number pages
  public numberPage: number[] = [];
  // Current page
  public page: number = 1;
  // Total pages
  public totalPages: number = 0;
  // Total elements
  public numUsers: number = 0;
  // Registers
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editUser", { static: false }) editUser: ElementRef;
  // Form
  @ViewChild('cssmFile', { static: false }) imageFile: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  // User in session
  userInSession = "";
  // Load
  isLoaded: boolean;
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param dataApi      Data API object
   * @param toastr       Toastr service
   * @param coreService  Core service
   */
  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.userObj = new UserInterface();
    this.element.scrollTop = 0;
    this.userInSession = localStorage.getItem('email');
    this.getAllRoles();
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.isLoaded = false;
    this.activeForm = false;
    this.isEditForm = false;
    this.auxEmail = "";
    this.getUsersByPage(this.page);
  }

  /**
   * Go to page number
   * @param page Number page
   */
  goToPage(page: number): void {
    this.page = page;
    this.getUsersByPage(page);
  }

  /**
   * Get user information by page
   * @param page Number page
   */
  getUsersByPage(page: Number): void {
    this.dataApi.getUsersByPage(page).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.users = data.allUsers;
        this.numUsers = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x, i) => i + 1);
        this.isLoaded = true;
      } else {
        this.numUsers = globalsConstants.K_ZERO_RESULTS;
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Reload data
   */
  onReload(): void {
    this.isLoaded = false;
    this.getUsersByPage(this.page);
  }

  /**
   * Get all roles
   */
  getAllRoles(): void {
    this.dataApi.getAllRoles().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.roles = data.allRoles;
      } else {
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * It enable the form and clear fields
   */
  onNewUser(): void {
    this.activeForm = true;
    this.isEditForm = false;
    this.auxEmail = "";

    this.userObj.id = null;
    this.userObj.name = globalsConstants.K_BLANK;;
    this.userObj.surname = globalsConstants.K_BLANK;;
    this.userObj.email = globalsConstants.K_BLANK;;
    this.userObj.telephone = null;
    this.userObj.address = globalsConstants.K_BLANK;;
    this.userObj.zipcode = null;
    this.userObj.city = globalsConstants.K_BLANK;;
    this.userObj.province = globalsConstants.K_BLANK;;
    setTimeout(() => {
      this.scrollToForm();
    }, 200);
  }

  /**
   * It enable the form in edit mode and set values in fields
   * @param user  Record to edit
   */
  onEditUser(user: UserInterface): void {
    this.activeForm = true;
    this.isEditForm = true;
    this.auxEmail = user.email;

    this.userObj.id = user.id;
    this.userObj.active = user.active;
    this.userObj.name = user.name;
    this.userObj.surname = user.surname;
    this.userObj.email = user.email;
    this.userObj.telephone = user.telephone;
    this.userObj.address = user.address;
    this.userObj.city = user.city;
    this.userObj.province = user.province;
    this.userObj.zipcode = user.zipcode;
    this.userObj.rol_id = user.rol_id;
    this.userRol = this.roles.find(e => e.id === user.rol_id);

    setTimeout(() => {
      this.scrollToForm();
    }, 200);
  }

  /**
   * Delete a record
   * @param user  Record to delete
   */
  onDeleteUser(user: UserInterface): void {
    Swal.fire({
      title: globalsConstants.K_USERMGT_DELETE_USER,
      text: globalsConstants.K_WARNING_ACTION,
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
          if (globalsConstants.K_COD_OK == data.cod) {
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

  /**
   * Block or unblock users
   * @param user  User to block or unblock
   */
  onLockUser(user: UserInterface): void {
    let auxActive = 0;
    if (1 == user.active) {
      this.alertLockStr = globalsConstants.K_USERMGT_DEACTIVE_USER;
      this.actionLockStr = globalsConstants.K_USERMGT_DEACTIVATED_STR;
      this.actionTextLockStr = globalsConstants.K_USERMGT_DEACTIVE_SUCCESS_SRT;
      auxActive = 1;
    }
    else {
      this.alertLockStr = globalsConstants.K_USERMGT_ACTIVE_USER;
      this.actionLockStr = globalsConstants.K_USERMGT_ACTIVATED_STR;
      this.actionTextLockStr = globalsConstants.K_USERMGT_ACTIVE_SUCCESS_SRT;
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
          if (globalsConstants.K_COD_OK == data.cod) {
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

  /**
   * Submit form information to create or edit the record
   * @param form Form with the information
   */
  onSubmit(form: NgForm): void {
    this.isLoaded = false;
    if (form.invalid) {
      this.isLoaded = true;
      return;
    }
    else {
      this.dataApi.validateEmail(this.userObj).subscribe((data) => {
        if (globalsConstants.K_COD_OK == data.cod) {
          if (data.exists && this.auxEmail != this.userObj.email) {
            this.isLoaded = true;
            form.controls.email.setErrors({ emailExists: true });
            return;
          }
          else {
            if (this.isEditForm) {
              this.userObj.rol_id = this.userRol.id;
              this.dataApi.updateUserById(this.userObj).subscribe((data) => {
                if (globalsConstants.K_COD_OK == data.cod) {
                  this.getUsersByPage(this.page);
                  this.onCancel();
                  this.isLoaded = true;
                  this.toastr.success(data.message, globalsConstants.K_UPDATE_STR);
                } else {
                  this.isLoaded = true;
                  this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
                }
              });
            } else {
              this.userObj.rol_id = this.userRol.id;
              this.dataApi.createUser(this.userObj).subscribe((data) => {
                if (globalsConstants.K_COD_OK == data.cod) {
                  this.getUsersByPage(this.page);
                  this.onCancel();
                  this.isLoaded = true;
                  this.toastr.success(data.message, globalsConstants.K_ADD_STR);
                } else {
                  this.isLoaded = true;
                  this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
                }
              });
            }
          }
        }
      });
    }
  }

  /**
   * Cancel edit
   */
  onCancel(): void {
    this.isEditForm = false;
    this.activeForm = false;
  }

  /**
   * Scroll to form
   */
  scrollToForm(): void {
    this.editUser.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

}
