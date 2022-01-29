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
import { OpinionInterface } from 'src/app/models/opinion-interface';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.css']
})
export class OpinionComponent implements OnInit {
  // Editor
  public Editor = ClassicEditor;
  // Globals
  globals: Globals;
  // Path
  path = environment.imageRootPath;
  // Opinions
  opinionObj: OpinionInterface;
  opinions: OpinionInterface[] = [];
  opinionImg: string;
  inHomeChk: boolean;
  // Form
  @ViewChild('cssmFile', { static: false }) imageFile: ElementRef;
  // Opinions - Image
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
  public numOpinions: number;
  // Registers
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editOpinion", { static: false }) editOpinion: ElementRef;
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
    this.opinionObj = new OpinionInterface();
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
    this.getOpinionsByPage(this.page);
  }

  /**
   * Go to page number
   * @param page Number page
   */
  goToPage(page: number): void {
    this.page = page;
    this.getOpinionsByPage(page);
  }

  /**
   * Get opinions information by page
   * @param page Number page
   */
  getOpinionsByPage(page: Number): void {
    this.dataApi.getOpinionsByPage(page).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.opinions = data.allOpinions;
        this.numOpinions = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x, i) => i + 1);
        this.isLoaded = true;
      } else {
        this.numOpinions = globalsConstants.K_ZERO_RESULTS;
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
    this.getOpinionsByPage(this.page);
  }

  /**
   * It enable the form and clear fields
   */
  onNewOpinion(): void {
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.opinionObj.id = null;
    this.opinionObj.home = 0;
    this.inHomeChk = false;
    this.opinionObj.name = globalsConstants.K_BLANK;
    this.opinionObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.opinionObj.commentary = globalsConstants.K_BLANK;
    this.opinionObj.rating = 0;
    setTimeout(() => {
      this.scrollToForm();
    }, 200);
  }

  /**
   * It enable the form in edit mode and set values in fields
   * @param opinion  Record to edit
   */
  onEditOpinion(opinion: OpinionInterface): void {
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    this.opinionObj.commentary = globalsConstants.K_BLANK;
    this.opinionObj.image = (opinion.image) ? opinion.image : globalsConstants.K_DEFAULT_IMAGE;

    setTimeout(() => {
      this.opinionObj.id = opinion.id;
      this.opinionObj.home = opinion.home;
      this.inHomeChk = (opinion.home == 1) ? true : false;
      this.opinionObj.name = opinion.name;
      this.opinionObj.commentary = opinion.commentary;
      this.opinionObj.rating = opinion.rating;
      this.scrollToForm();
    }, 200);
  }

  /**
   * Delete a record
   * @param opinion  Record to delete
   */
  onDeleteOpinion(opinion: OpinionInterface): void {
    Swal.fire({
      title: globalsConstants.K_OPINION_DELETE,
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
        this.dataApi.deleteOpinionById(opinion.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getOpinionsByPage(this.page);
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
            this.coreService.createNotification(
              globalsConstants.K_MOD_OPINION, globalsConstants.K_DELETE_MOD, opinion.name,
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
    if (globalsConstants.K_DEFAULT_IMAGE != this.opinionObj.image) {
      Swal.fire({
        title: globalsConstants.K_OPINION_DELETE_IMAGE,
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
          this.opinionObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateOpinionById(this.opinionObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getOpinionsByPage(this.page);
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
    else {
      if (1 > this.opinionObj.rating) {
        this.opinionObj.rating = 1;
      }
      else if (5 < this.opinionObj.rating) {
        this.opinionObj.rating = 5;
      }
    }

    if (this.isEditForm) {
      if (this.changeImage && this.selectedImg != null) {
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.opinionImg = img['message'];
          this.opinionObj.image = this.opinionImg;
          this.uploadSuccess = false;
          this.dataApi.updateOpinionById(this.opinionObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getOpinionsByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_OPINION, globalsConstants.K_UPDATE_MOD, this.opinionObj.name,
                globalsConstants.K_ALL_USERS);
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
            } else {
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else {
        this.dataApi.updateOpinionById(this.opinionObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getOpinionsByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_OPINION, globalsConstants.K_UPDATE_MOD, this.opinionObj.name,
              globalsConstants.K_ALL_USERS);
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
          this.opinionImg = img['message'];
          this.opinionObj.image = this.opinionImg;
          this.uploadSuccess = false;
          this.dataApi.createOpinion(this.opinionObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getOpinionsByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_OPINION, globalsConstants.K_INSERT_NEW_MOD, this.opinionObj.name,
                globalsConstants.K_ALL_USERS);
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_ADD_F_STR);
            } else {
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else {
        this.dataApi.createOpinion(this.opinionObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getOpinionsByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_OPINION, globalsConstants.K_INSERT_NEW_MOD, this.opinionObj.name,
              globalsConstants.K_ALL_USERS);
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_ADD_F_STR);
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
    this.editOpinion.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Set whether the review is on the home page or not
   * @param e  Event
   */
  toggleVisibility(e): void {
    this.opinionObj.home = (this.inHomeChk) ? 1 : 0;
  }

  /**
   * Fill in the number of stars according to the rating
   * @param  index  Total rating
   * @return List with the number of stars
   */
  counterRating(index: number) {
    let list = new Array();
    for (let i = 0; i < index; i++) {
      list.push(i);
    }
    return list;
  }
}
