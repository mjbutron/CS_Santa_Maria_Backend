import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-custom';
// Service
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { WorkshopInterface } from 'src/app/models/workshop-interface';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {
  // Editor
  public Editor = ClassicEditor;
  // Globals
  globals: Globals;
  // Path
  path = environment.imageRootPath;
  // Workshops
  workShopObj: WorkshopInterface;
  workShops: WorkshopInterface[] = [];
  workshopImg: string;
  inHomeChk: boolean;
  noDate = globalsConstants.K_NO_DATE_STR;
  // Form
  @ViewChild('cssmFile', { static: false }) imageFile: ElementRef;
  // Workshops - Image
  selectedImg: File;
  uploadSuccess: boolean;
  progress: number = 0;
  inNewChk: boolean;
  // Number pages
  public numberPage: number[] = [];
  // PCurrent page
  public page: number = 1;
  // Total pages
  public totalPages: number;
  // Total elements
  public numWorkShops: number;
  // Registers
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editWorkshop", { static: false }) editWorkshop: ElementRef;
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
   * [constructor description]
   * @param dataApi      Data API object
   * @param toastr       Toastr service
   * @param coreService  Core service
   * @param globals      Globals
   */
  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService, globals: Globals) {
    this.globals = globals;
    this.workShopObj = new WorkshopInterface();
    this.inHomeChk = false;
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
    this.getWorkShopsByPage(this.page);
  }

  /**
   * Go to page number
   * @param page Number page
   */
  goToPage(page: number): void {
    this.page = page;
    this.getWorkShopsByPage(page);
  }

  /**
   * Get workshop information by page
   * @param page Number page
   */
  getWorkShopsByPage(page: Number): void {
    this.dataApi.getWorkShopsByPage(page).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.workShops = data.allWorkshops;
        this.numWorkShops = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x, i) => i + 1);
        this.isLoaded = true;
      } else {
        this.numWorkShops = globalsConstants.K_ZERO_RESULTS;
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
    this.getWorkShopsByPage(this.page);
  }

  /**
   * It enable the form and clear fields
   */
  onNewWorkshop(): void {
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;
    this.inNewChk = true;

    this.workShopObj.id = null;
    this.workShopObj.active = 0;
    this.workShopObj.home = 0;
    this.inHomeChk = false;
    this.workShopObj.title = globalsConstants.K_BLANK;
    this.workShopObj.short_description = globalsConstants.K_BLANK;
    this.workShopObj.description = globalsConstants.K_BLANK;
    this.workShopObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.workShopObj.subtitle = globalsConstants.K_BLANK;
    this.workShopObj.price = 0;
    this.workShopObj.address = globalsConstants.K_BLANK;
    this.workShopObj.session_date = globalsConstants.K_BLANK;
    this.workShopObj.session_start = globalsConstants.K_BLANK;
    this.workShopObj.session_end = globalsConstants.K_BLANK;
    this.workShopObj.hours = 0;
    this.workShopObj.places = 0;
    this.workShopObj.free_places = 0;
    this.workShopObj.new_workshop = 1;
    this.workShopObj.impart = globalsConstants.K_BLANK;
    setTimeout(() => {
      this.scrollToForm();
    }, 200);
  }

  /**
   * It enable the form in edit mode and set values in fields
   * @param workShop  Record to edit
   */
  onEditWorkshop(workShop: WorkshopInterface): void {
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    this.workShopObj.description = globalsConstants.K_BLANK;
    this.workShopObj.image = (workShop.image) ? workShop.image : globalsConstants.K_DEFAULT_IMAGE;

    setTimeout(() => {
      this.workShopObj.id = workShop.id;
      this.workShopObj.active = workShop.active;
      this.workShopObj.home = workShop.home;
      this.inHomeChk = (workShop.home == 1) ? true : false;
      this.workShopObj.title = workShop.title;
      this.workShopObj.short_description = workShop.short_description;
      this.workShopObj.description = workShop.description;
      this.workShopObj.subtitle = workShop.subtitle;
      this.workShopObj.price = workShop.price;
      this.workShopObj.address = workShop.address;
      this.workShopObj.session_date = workShop.session_date;
      this.workShopObj.session_start = workShop.session_start;
      this.workShopObj.session_end = workShop.session_end;
      this.workShopObj.hours = workShop.hours;
      this.workShopObj.places = workShop.places;
      this.workShopObj.free_places = workShop.free_places;
      this.workShopObj.new_workshop = workShop.new_workshop;
      this.inNewChk = (workShop.new_workshop == 1) ? true : false;
      this.workShopObj.impart = workShop.impart;
      this.scrollToForm();
    }, 200);
  }

  /**
   * Delete a record
   * @param workShop  Record to delete
   */
  onDeleteWorkshop(workShop: WorkshopInterface): void {
    Swal.fire({
      title: globalsConstants.K_WORKSHOP_DELETE_WORKSHOP,
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
        this.dataApi.deleteWorkshopById(workShop.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getWorkShopsByPage(this.page);
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
              globalsConstants.K_MOD_WORKSHOP, globalsConstants.K_DELETE_MOD, workShop.title,
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
    if (globalsConstants.K_DEFAULT_IMAGE != this.workShopObj.image) {
      Swal.fire({
        title: globalsConstants.K_WORKSHOP_DELETE_IMAGE,
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
          this.workShopObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getWorkShopsByPage(this.page);
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
          this.workshopImg = img['message'];
          this.workShopObj.image = this.workshopImg;
          this.uploadSuccess = false;
          this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getWorkShopsByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_WORKSHOP, globalsConstants.K_UPDATE_MOD, this.workShopObj.title,
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
        this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getWorkShopsByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_WORKSHOP, globalsConstants.K_UPDATE_MOD, this.workShopObj.title,
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
      this.workShopObj.free_places = this.workShopObj.places;
      if (this.changeImage && this.selectedImg != null) {
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.workshopImg = img['message'];
          this.workShopObj.image = this.workshopImg;
          this.uploadSuccess = false;
          this.dataApi.createWorkshop(this.workShopObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getWorkShopsByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_WORKSHOP, globalsConstants.K_INSERT_NEW_MOD, this.workShopObj.title,
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
        this.dataApi.createWorkshop(this.workShopObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getWorkShopsByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_WORKSHOP, globalsConstants.K_INSERT_NEW_MOD, this.workShopObj.title,
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
    this.editWorkshop.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Set whether the workshop is on the home page or not
   * @param e  Event
   */
  toggleVisibility(e): void {
    this.workShopObj.home = (this.inHomeChk) ? 1 : 0;
  }

  /**
   * Active or deactive workshop
   * @param workshop Workshop to deactivate or activate
   */
  onActiveWorkshop(workshop: WorkshopInterface): void {
    let auxActive = 0;
    if (1 == workshop.active) {
      this.alertActiveStr = globalsConstants.K_WORKSHOP_DEACTIVE_WORKSHOP;
      this.actionActiveStr = globalsConstants.K_WORKSHOP_DEACTIVATED_STR;
      this.actionTextActiveStr = globalsConstants.K_WORKSHOP_DEACTIVE_SUCCESS_SRT;
      auxActive = 1;
    }
    else {
      this.alertActiveStr = globalsConstants.K_WORKSHOP_ACTIVE_WORKSHOP;
      this.actionActiveStr = globalsConstants.K_WORKSHOP_ACTIVATED_STR;
      this.actionTextActiveStr = globalsConstants.K_WORKSHOP_ACTIVE_SUCCESS_SRT;
      auxActive = 0;
    }

    Swal.fire({
      title: this.alertActiveStr,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_OK_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        workshop.active = (workshop.active == 0) ? 1 : 0;
        this.dataApi.updateWorkshopById(workshop).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            workshop.active = auxActive;
            this.getWorkShopsByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              this.actionActiveStr,
              this.actionTextActiveStr,
              'success'
            )
            if (!workshop.active) {
              this.coreService.createNotification(
                globalsConstants.K_MOD_WORKSHOP, globalsConstants.K_ACTIVE_MOD, workshop.title,
                globalsConstants.K_ALL_USERS);
            }
            else {
              this.coreService.createNotification(
                globalsConstants.K_MOD_WORKSHOP, globalsConstants.K_DEACTIVE_MOD, workshop.title,
                globalsConstants.K_ALL_USERS);
            }
          } else {
            workshop.active = auxActive;
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
