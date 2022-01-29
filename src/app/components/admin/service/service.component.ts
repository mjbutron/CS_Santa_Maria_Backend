import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-custom';
// Services
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { ServiceInterface } from 'src/app/models/service-interface';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  // Editor
  public Editor = ClassicEditor;
  // Globals
  globals: Globals;
  // Path
  path = environment.imageRootPath;
  // Services
  serviceObj: ServiceInterface;
  services: ServiceInterface[] = [];
  serviceImg: string;
  // Form
  @ViewChild('cssmFile', { static: false }) imageFile: ElementRef;
  // Services - Image
  selectedImg: File;
  uploadSuccess: boolean;
  progress: number = 0;
  // Number pages
  public numberPage: number[] = [];
  // Current page
  public page: number = 1;
  // Total Pages
  public totalPages: number;
  // Total elements
  public numServices: number;
  // Registers
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editService", { static: false }) editService: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;
  // Utils
  alertActiveStr = "";
  actionActiveStr = "";
  actionTextActiveStr = "";
  // Load
  isLoaded: boolean;
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param dataApi      Data API object
   * @param toastr       Toastr service
   * @param coreService  Core service object
   * @param globals      Globals
   */
  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService, globals: Globals) {
    this.globals = globals;
    this.serviceObj = new ServiceInterface();
    this.element.scrollTop = 0;
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.isLoaded = false;
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.getServicesByPage(this.page);
  }

  /**
   * Go to page number
   * @param page Number page
   */
  goToPage(page: number): void {
    this.page = page;
    this.getServicesByPage(page);
  }

  /**
   * Get services information by page
   * @param page Number page
   */
  getServicesByPage(page: Number): void {
    this.dataApi.getServicesByPage(page).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.services = data.allServices;
        this.numServices = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x, i) => i + 1);
        this.isLoaded = true;
      } else {
        this.numServices = globalsConstants.K_ZERO_RESULTS;
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
    this.getServicesByPage(this.page);
  }

  /**
   * It enable the form and clear fields
   */
  onNewService(): void {
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.serviceObj.id = null;
    this.serviceObj.active = 0;
    this.serviceObj.title = globalsConstants.K_BLANK;
    this.serviceObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.serviceObj.subtitle = globalsConstants.K_BLANK;
    this.serviceObj.description = globalsConstants.K_BLANK;
    setTimeout(() => {
      this.scrollToForm();
    }, 200);
  }

  /**
   * It enable the form in edit mode and set values in fields
   * @param service  Record to edit
   */
  onEditService(service: ServiceInterface): void {
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    this.serviceObj.description = globalsConstants.K_BLANK;
    this.serviceObj.image = (service.image) ? service.image : globalsConstants.K_DEFAULT_IMAGE;

    setTimeout(() => {
      this.serviceObj.id = service.id;
      this.serviceObj.active = service.active;
      this.serviceObj.title = service.title;
      this.serviceObj.subtitle = service.subtitle;
      this.serviceObj.description = service.description;
      this.scrollToForm();
    }, 200);
  }

  /**
   * Delete a record
   * @param service  Record to delete
   */
  onDeleteService(service: ServiceInterface): void {
    Swal.fire({
      title: globalsConstants.K_SERVICE_DELETE,
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
        this.dataApi.deleteServiceById(service.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getServicesByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.uploadSuccess = false;
            this.changeImage = false;
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_DELETE_EXC_STR,
              data.message,
              'success'
            )
            this.coreService.createNotification(
              globalsConstants.K_MOD_SERVICE, globalsConstants.K_DELETE_MOD, service.title,
              globalsConstants.K_ALL_USERS);
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
   * Edit image
   */
  onEditImage(): void {
    this.changeImage = true;
  }

  /**
   * Cancel edit image
   */
  onCancelEditImage(): void {
    this.changeImage = false;
  }

  /**
   * Delete image
   */
  onDeleteImage(): void {
    if (globalsConstants.K_DEFAULT_IMAGE != this.serviceObj.image) {
      Swal.fire({
        title: globalsConstants.K_SERVICE_DELETE_IMAGE,
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
          this.serviceObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateServiceById(this.serviceObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getServicesByPage(this.page);
              this.onCancel();
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
   * Submit form information to create or edit the record
   * @param form Form with the information
   */
  onSubmit(form: NgForm): void {
    this.isLoaded = false;
    if (form.invalid) {
      this.isLoaded = true;
      return;
    }

    if (this.isEditForm) {
      if (this.changeImage && this.selectedImg != null) {
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.serviceImg = img['message'];
          this.serviceObj.image = this.serviceImg;
          this.uploadSuccess = false;
          this.dataApi.updateServiceById(this.serviceObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getServicesByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_SERVICE, globalsConstants.K_UPDATE_MOD, this.serviceObj.title,
                globalsConstants.K_ALL_USERS);
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_UPDATE_STR);
            } else {
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else {
        this.dataApi.updateServiceById(this.serviceObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getServicesByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_SERVICE, globalsConstants.K_UPDATE_MOD, this.serviceObj.title,
              globalsConstants.K_ALL_USERS);
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_UPDATE_STR);
          } else {
            this.isLoaded = true;
            this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
          }
        });
      }
    } else {
      if (this.changeImage && this.selectedImg != null) {
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.serviceImg = img['message'];
          this.serviceObj.image = this.serviceImg;
          this.uploadSuccess = false;
          this.dataApi.createService(this.serviceObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getServicesByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_SERVICE, globalsConstants.K_INSERT_NEW_MOD, this.serviceObj.title,
                globalsConstants.K_ALL_USERS);
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_ADD_STR);
            } else {
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else {
        this.dataApi.createService(this.serviceObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getServicesByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_SERVICE, globalsConstants.K_INSERT_NEW_MOD, this.serviceObj.title,
              globalsConstants.K_ALL_USERS);
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

  /**
   * Cancel edit
   */
  onCancel(): void {
    this.isEditForm = false;
    this.activeForm = false;
    this.uploadSuccess = false;
    this.changeImage = false;
  }

  /**
   * Scroll to form
   */
  scrollToForm(): void {
    this.editService.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Active or deactive service
   * @param service Service to deactivate or activate
   */
  onActiveService(service: ServiceInterface): void {
    let auxActive = 0;
    if (1 == service.active) {
      this.alertActiveStr = globalsConstants.K_SERVICE_DEACTIVE_SERVICE;
      this.actionActiveStr = globalsConstants.K_SERVICE_DEACTIVATED_STR;
      this.actionTextActiveStr = globalsConstants.K_SERVICE_DEACTIVE_SUCCESS_SRT;
      auxActive = 1;
    }
    else {
      this.alertActiveStr = globalsConstants.K_SERVICE_ACTIVE_SERVICE;
      this.actionActiveStr = globalsConstants.K_SERVICE_ACTIVATED_STR;
      this.actionTextActiveStr = globalsConstants.K_SERVICE_ACTIVE_SUCCESS_SRT;
      auxActive = 0;
    }

    Swal.fire({
      title: this.alertActiveStr,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_OK_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        service.active = (service.active == 0) ? 1 : 0;
        this.dataApi.updateServiceById(service).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            service.active = auxActive;
            this.getServicesByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              this.actionActiveStr,
              this.actionTextActiveStr,
              'success'
            )
            if (!service.active) {
              this.coreService.createNotification(
                globalsConstants.K_MOD_SERVICE, globalsConstants.K_ACTIVE_MOD, service.title,
                globalsConstants.K_ALL_USERS);
            }
            else {
              this.coreService.createNotification(
                globalsConstants.K_MOD_SERVICE, globalsConstants.K_DEACTIVE_MOD, service.title,
                globalsConstants.K_ALL_USERS);
            }
          } else {
            service.active = auxActive;
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
}
