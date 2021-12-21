import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
// Services
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { AboutUsInterface } from 'src/app/models/aboutus-interface';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  // Globals
  globals: Globals;
  // Path
  path = environment.imageRootPath;
  // AboutUs
  aboutUsObj: AboutUsInterface;
  aboutUs: AboutUsInterface[] = [];
  aboutUsImg: string;
  // Form
  @ViewChild('cssmFile', { static: false }) imageFile: ElementRef;
  // AboutUs - Image
  selectedImg: File;
  uploadSuccess: boolean;
  progress: number = 0;
  // Number pages
  public numberPage: number[] = [];
  // Current page
  public page: number = 1;
  // Total pages
  public totalPages: number;
  // Total elements
  public numAboutUs: number;
  // Registers
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editAboutUs", { static: false }) editAboutUs: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;
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
    this.aboutUsObj = new AboutUsInterface();
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
    this.getAboutUsByPage(this.page);
  }

  /**
   * Go to page number
   * @param page Number page
   */
  goToPage(page: number): void {
    this.page = page;
    this.getAboutUsByPage(page);
  }

  /**
   * Get about us information by page
   * @param page Number page
   */
  getAboutUsByPage(page: Number): void {
    this.dataApi.getAboutUsByPage(page).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.aboutUs = data.allAboutUs;
        this.numAboutUs = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x, i) => i + 1);
        this.isLoaded = true;
      } else {
        this.numAboutUs = globalsConstants.K_ZERO_RESULTS;
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
    this.getAboutUsByPage(this.page);
  }

  /**
   * It enable the form and clear fields
   */
  onNewAboutUs(): void {
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.aboutUsObj.id = null;
    this.aboutUsObj.name = globalsConstants.K_BLANK;
    this.aboutUsObj.surname1 = globalsConstants.K_BLANK;
    this.aboutUsObj.surname2 = globalsConstants.K_BLANK;
    this.aboutUsObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.aboutUsObj.position = globalsConstants.K_BLANK;
    this.aboutUsObj.description = globalsConstants.K_BLANK;
    this.aboutUsObj.academic_degree = globalsConstants.K_BLANK;
    this.aboutUsObj.user_fcbk = globalsConstants.K_BLANK;
    this.aboutUsObj.user_ytube = globalsConstants.K_BLANK;
    this.aboutUsObj.user_insta = globalsConstants.K_BLANK;
    this.aboutUsObj.user_id = this.globals.userID;
    setTimeout(() => {
      this.scrollToForm();
    }, 200);
  }

  /**
   * It enable the form in edit mode and set values in fields
   * @param aboutUs Record to edit
   */
  onEditAboutUs(aboutUs: AboutUsInterface): void {
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;

    this.aboutUsObj.id = aboutUs.id;
    this.aboutUsObj.name = aboutUs.name;
    this.aboutUsObj.surname1 = aboutUs.surname1;
    this.aboutUsObj.surname2 = aboutUs.surname2;
    this.aboutUsObj.image = (aboutUs.image) ? aboutUs.image : globalsConstants.K_DEFAULT_IMAGE;
    this.aboutUsObj.position = aboutUs.position;
    this.aboutUsObj.description = aboutUs.description;
    this.aboutUsObj.academic_degree = aboutUs.academic_degree;
    this.aboutUsObj.user_fcbk = aboutUs.user_fcbk;
    this.aboutUsObj.user_ytube = aboutUs.user_ytube;
    this.aboutUsObj.user_insta = aboutUs.user_insta;
    this.aboutUsObj.user_id = this.globals.userID;
    setTimeout(() => {
      this.scrollToForm();
    }, 200);
  }

  /**
   * Delete a record
   * @param aboutUs  Record to delete
   */
  onDeleteAboutUs(aboutUs: AboutUsInterface): void {
    Swal.fire({
      title: globalsConstants.K_ABOUTUS_DELETE,
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
        this.dataApi.deleteAboutUsId(aboutUs.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getAboutUsByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.uploadSuccess = false;
            this.changeImage = false;
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_DELETE_F_EXC_STR,
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
    if (globalsConstants.K_DEFAULT_IMAGE != this.aboutUsObj.image) {
      Swal.fire({
        title: globalsConstants.K_ABOUTUS_DELETE_IMAGE,
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
          this.aboutUsObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateAboutUsById(this.aboutUsObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getAboutUsByPage(this.page);
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
          this.aboutUsImg = img['message'];
          this.aboutUsObj.image = this.aboutUsImg;
          this.uploadSuccess = false;
          this.dataApi.updateAboutUsById(this.aboutUsObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getAboutUsByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
            } else {
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else {
        this.dataApi.updateAboutUsById(this.aboutUsObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getAboutUsByPage(this.page);
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
          } else {
            this.isLoaded = true;
            this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
          }
        });
      }
    } else {
      if (this.changeImage && this.selectedImg != null) {
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.aboutUsImg = img['message'];
          this.aboutUsObj.image = this.aboutUsImg;
          this.uploadSuccess = false;
          this.dataApi.createAboutUs(this.aboutUsObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getAboutUsByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_CREATE_F_STR);
            } else {
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else {
        this.dataApi.createAboutUs(this.aboutUsObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getAboutUsByPage(this.page);
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_CREATE_F_STR);
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
    this.editAboutUs.nativeElement.scrollIntoView({ behavior: "smooth" });
  }
}
