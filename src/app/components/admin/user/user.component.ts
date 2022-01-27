import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
// Services
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { UserInterface } from 'src/app/models/user-interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  // Path
  path = environment.imageRootPath;
  assetsImg = environment.pathImage;
  // User Obj
  userObj: UserInterface;
  // Utils
  globals: Globals;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Social Form
  @ViewChild("editSocial", { static: false }) editSocial: ElementRef;
  // Scroll Image Form
  @ViewChild("editImage", { static: false }) editImage: ElementRef;
  // Notifications
  numNotifications = 0;
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
  @ViewChild('cssmFile', { static: false }) imageFile: ElementRef;
  // Pass
  currentPass = "";
  errorCurrentPass = "";
  newPass = "";
  errorNewPass = "";
  repetNewPass = "";
  errorRepetNewPass = "";
  // Load
  isLoaded: boolean;
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param dataApi      Data API object
   * @param toastr       Toastr service
   * @param coreService  Core service
   * @param globals      Globals
   */
  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService, globals: Globals) {
    this.userObj = new UserInterface();
    this.userObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.globals = globals;
    this.element.scrollTop = 0;
    this.setGlobalsData();
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.activeFormImage = false;
    this.disabledFormImage = true;
    this.uploadSuccess = false;
    this.getUserProfile();
    this.findNotifications();
  }

  /**
   * Sets global data. Obtained from local storage
   */
  setGlobalsData(): void {
    this.globals.user_name = localStorage.getItem('username');
    this.globals.rol_name = localStorage.getItem('rolname');
    this.globals.userImage = localStorage.getItem('userImage');
  }

  /**
   * Get user profile information
   */
  getUserProfile(): void {
    this.isLoaded = false;
    this.userObj.email = localStorage.getItem('email');
    this.dataApi.getUserProfile(this.userObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.userObj = data.user;
        this.userObj.image = (data.user.image) ? data.user.image : globalsConstants.K_DEFAULT_AVATAR;
        this.isLoaded = true;
      }
      else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Check notifications
   */
  findNotifications(): void {
    this.coreService.findNotifications().subscribe(data => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.numNotifications = data.foundNotifications;
      } else {
        this.numNotifications = globalsConstants.K_ZERO_RESULTS;
      }
    });
  }

  /**
   * Edit user
   */
  onEditUser(): void {
    this.disabledForm = false;
    this.activeForm = true;
  }

  /**
   * Delete image
   */
  onDeleteImage(): void {
    if (globalsConstants.K_DEFAULT_IMAGE != this.userObj.image) {
      Swal.fire({
        title: globalsConstants.K_USER_DELETE_IMAGE,
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
          this.userObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              localStorage.setItem('userImage', this.userObj.image);
              this.setGlobalsData();
              this.getUserProfile();
              this.onCancelEditImage();
              this.isLoaded = true;
              Swal.fire(
                globalsConstants.K_DELETE_IMAGE_STR,
                globalsConstants.K_DELETE_IMG_SUCCESS,
                'success'
              )
            }
            else {
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
    else {
      this.toastr.info(globalsConstants.K_NO_IMAGE_INFO, globalsConstants.K_INFO_STR);
    }
  }

  /**
   * Cancel edit user
   */
  onCancelEdit(): void {
    this.getUserProfile();
    this.activeForm = false;
    this.disabledForm = true;
  }

  /**
   * Edit user password
   */
  onEditPassword(): void {
    this.disabledFormPass = false;
    this.activeFormPass = true;
  }

  /**
   * Cancel edit password
   * @param form  Form to reset
   */
  onCancelEditPass(form: NgForm): void {
    this.activeFormPass = false;
    this.disabledFormPass = true;
    form.reset();
  }

  /**
   * Edit social links
   */
  onEditSocial(): void {
    this.disabledFormSocial = false;
    this.activeFormSocial = true;
  }

  /**
   * Cancel edit social links
   */
  onCancelEditSocial(): void {
    this.getUserProfile();
    this.activeFormSocial = false;
    this.disabledFormSocial = true;
  }

  /**
   * Edit image
   */
  onEditImage(): void {
    this.disabledFormImage = false;
    this.activeFormImage = true;
  }

  /**
   * Cancel edit image
   */
  onCancelEditImage(): void {
    this.activeFormImage = false;
    this.disabledFormImage = true;
    this.uploadSuccess = false;
  }

  /**
   * Submit form information to edit user
   * @param form Form with the information
   */
  onSubmitUser(form: NgForm): void {
    this.isLoaded = false;
    if (form.invalid) {
      this.isLoaded = true;
      return;
    }
    this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        localStorage.setItem('username', this.userObj.name);
        this.setGlobalsData();
        this.activeForm = false;
        this.disabledForm = true;
        this.isLoaded = true;
        this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
      }
      else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Submit form information to edit image
   * @param form Form with the information
   */
  onSubmitImage(form: NgForm): void {
    this.isLoaded = false;
    if (this.activeFormImage && this.selectedImg != null) {
      this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
        this.userImg = img['message'];
        this.userObj.image = this.userImg;
        this.uploadSuccess = false;
        this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            localStorage.setItem('userImage', this.userObj.image);
            this.setGlobalsData();
            this.getUserProfile();
            this.onCancelEditImage();
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
          }
          else {
            this.isLoaded = true;
            this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
          }
        });
      });
    }
  }

  /**
   * Submit form information to edit social links
   * @param form Form with the information
   */
  onSubmitSocial(form: NgForm): void {
    this.isLoaded = false;
    if (form.invalid) {
      this.isLoaded = true;
      return;
    }
    this.dataApi.updateUserProfile(this.userObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.activeFormSocial = false;
        this.disabledFormSocial = true;
        this.isLoaded = true;
        this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
      }
      else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Submit form information to edit password
   * @param form Form with the information
   */
  onSubmitPass(form: NgForm): void {
    this.isLoaded = false;
    if (form.invalid) {
      this.isLoaded = true;
      return;
    } else if (this.currentPass == this.newPass) {
      this.isLoaded = true;
      Swal.fire({
        icon: 'error',
        text: globalsConstants.K_USER_SAME_PASS_ALERT
      });
      return;
    } else if (this.newPass != this.repetNewPass) {
      this.isLoaded = true;
      Swal.fire({
        icon: 'error',
        text: globalsConstants.K_USER_PASS_NOT_MATCH_ALERT
      });
      return;
    }
    this.dataApi.checkPassword(this.userObj, this.currentPass).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (data.check) {
          this.dataApi.updatePassword(this.userObj, this.newPass).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.globals.isChangePass = true;
              this.onCancelEditPass(form);
              this.isLoaded = true;
              this.toastr.success(globalsConstants.K_USER_PASS_CHANGE_SUCCESS, globalsConstants.K_UPDATE_F_STR);
            }
            else {
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        }
        else {
          this.isLoaded = true;
          Swal.fire({
            icon: 'error',
            text: globalsConstants.K_USER_WRONG_PASS
          });
          return;
        }
      }
      else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Scroll to form
   */
  scrollToForm(): void {
    this.editSocial.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Go to social link
   * @param url  Url social link
   */
  goToLink(url: string): void {
    window.open(url, "_blank");
  }

  /**
   * Scroll to image
   */
  scrollToChangeImage(): void {
    this.editImage.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Preload image
   * @param  $event
   */
  onFileChanged($event) {
    if ($event != null) {
      this.selectedImg = $event.target.files[0];
      if (this.selectedImg.size > globalsConstants.K_MAX_SIZE) {
        this.imageFile.nativeElement.value = globalsConstants.K_BLANK;
        this.toastr.error(globalsConstants.K_ERROR_SIZE, globalsConstants.K_ERROR_STR);
        return;
      } else {
        for (let i = 0; i <= 100; i++) {
          setTimeout(() => {
            this.progress = i;
          }, 500);
        }
        this.uploadSuccess = true;
        setTimeout(() => {
          this.progress = 0;
        }, 2500);
      }
    } else {
      return;
    }
  }
}
