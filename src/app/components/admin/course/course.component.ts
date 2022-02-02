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
import { CourseInterface } from 'src/app/models/course-interface';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  // Editor
  public Editor = ClassicEditor;
  // Globals
  globals: Globals;
  // Image path
  path = environment.imageRootPath;
  // Courses
  courseObj: CourseInterface;
  courses: CourseInterface[] = [];
  courseImg: string;
  inOfferChk: boolean;
  inNewChk: boolean;
  noDate = globalsConstants.K_NO_DATE_STR;
  // Form
  @ViewChild('cssmFile', { static: false }) imageFile: ElementRef;
  // Courses - Image
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
  public numCourses: number;
  // Registers
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editCourse", { static: false }) editCourse: ElementRef;
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
    this.courseObj = new CourseInterface();
    this.inOfferChk = false;
    this.inNewChk = false;
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
    this.getCoursesByPage(this.page);
  }

  /**
   * Go to page number
   * @param page Number page
   */
  goToPage(page: number): void {
    this.page = page;
    this.getCoursesByPage(page);
  }

  /**
   * Get courses information by page
   * @param page Number page
   */
  getCoursesByPage(page: Number): void {
    this.dataApi.getCoursesByPage(page).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.courses = data.allCourses;
        this.numCourses = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x, i) => i + 1);
        this.isLoaded = true;
      } else {
        this.numCourses = globalsConstants.K_ZERO_RESULTS;
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
    this.getCoursesByPage(this.page);
  }

  /**
   * It enable the form and clear fields
   */
  onNewCourse(): void {
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;
    this.inOfferChk = false;
    this.inNewChk = true;

    this.courseObj.id = null;
    this.courseObj.active = 0;
    this.courseObj.title = globalsConstants.K_BLANK;
    this.courseObj.short_description = globalsConstants.K_BLANK;
    this.courseObj.description = globalsConstants.K_BLANK;
    this.courseObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.courseObj.new_course = 1;
    this.courseObj.offer = 0;
    this.courseObj.address = globalsConstants.K_BLANK;
    this.courseObj.session_date = globalsConstants.K_BLANK;
    this.courseObj.session_start = globalsConstants.K_BLANK;
    this.courseObj.session_end = globalsConstants.K_BLANK;
    this.courseObj.sessions = 0;
    this.courseObj.hours = 0;
    this.courseObj.impart = globalsConstants.K_BLANK;
    this.courseObj.places = 0;
    this.courseObj.free_places = 0;
    this.courseObj.price = 0;
    setTimeout(() => {
      this.scrollToForm();
    }, 200);
  }

  /**
   * It enable the form in edit mode and set values in fields
   * @param course Record to edit
   */
  onEditCourse(course: CourseInterface): void {
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    this.courseObj.description = globalsConstants.K_BLANK;
    this.courseObj.image = (course.image) ? course.image : globalsConstants.K_DEFAULT_IMAGE;

    setTimeout(() => {
      this.courseObj.id = course.id;
      this.courseObj.active = course.active;
      this.courseObj.title = course.title;
      this.courseObj.short_description = course.short_description;
      this.courseObj.description = course.description;
      this.courseObj.new_course = course.new_course;
      this.inNewChk = (course.new_course == 1) ? true : false;
      this.courseObj.offer = course.offer;
      this.inOfferChk = (course.offer == 1) ? true : false;
      this.courseObj.address = course.address;
      this.courseObj.session_date = course.session_date;
      this.courseObj.session_start = course.session_start;
      this.courseObj.session_end = course.session_end;
      this.courseObj.sessions = course.sessions;
      this.courseObj.hours = course.hours;
      this.courseObj.impart = course.impart;
      this.courseObj.places = course.places;
      this.courseObj.free_places = course.free_places;
      this.courseObj.price = course.price;
      this.scrollToForm();
    }, 200);
  }

  /**
   * Delete a record
   * @param course  Record to delete
   */
  onDeleteCourse(course: CourseInterface): void {
    Swal.fire({
      title: globalsConstants.K_COURSE_DELETE_COURSE,
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
        this.dataApi.deleteCourseById(course.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getCoursesByPage(this.page);
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
              globalsConstants.K_MOD_COURSE, globalsConstants.K_DELETE_MOD, course.title,
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
    if (globalsConstants.K_DEFAULT_IMAGE != this.courseObj.image) {
      Swal.fire({
        title: globalsConstants.K_COURSE_DELETE_IMAGE,
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
          this.courseObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateCourseById(this.courseObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getCoursesByPage(this.page);
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
          this.courseImg = img['message'];
          this.courseObj.image = this.courseImg;
          this.uploadSuccess = false;
          this.dataApi.updateCourseById(this.courseObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getCoursesByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_COURSE, globalsConstants.K_UPDATE_MOD, this.courseObj.title,
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
        this.dataApi.updateCourseById(this.courseObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getCoursesByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_COURSE, globalsConstants.K_UPDATE_MOD, this.courseObj.title,
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
      this.courseObj.free_places = this.courseObj.places;
      if (this.changeImage && this.selectedImg != null) {
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.courseImg = img['message'];
          this.courseObj.image = this.courseImg;
          this.uploadSuccess = false;
          this.dataApi.createCourse(this.courseObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod) {
              this.getCoursesByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_COURSE, globalsConstants.K_INSERT_NEW_MOD, this.courseObj.title,
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
        this.dataApi.createCourse(this.courseObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getCoursesByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_COURSE, globalsConstants.K_INSERT_NEW_MOD, this.courseObj.title,
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
    this.editCourse.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Establish if it is a new course or is on offer
   * @param e  Event
   */
  toggleVisibility(e): void {
    this.courseObj.new_course = (this.inNewChk) ? 1 : 0;
    this.courseObj.offer = (this.inOfferChk) ? 1 : 0;
  }

  /**
   * Active or deactive course
   * @param course Course to deactivate or activate
   */
  onActiveCourse(course: CourseInterface): void {
    let auxActive = 0;
    if (1 == course.active) {
      this.alertActiveStr = globalsConstants.K_COURSE_DEACTIVE_COURSE;
      this.actionActiveStr = globalsConstants.K_COURSE_DEACTIVE_STR;
      this.actionTextActiveStr = globalsConstants.K_COURSE_DEACTIVE_SUCCESS_SRT;
      auxActive = 1;
    }
    else {
      this.alertActiveStr = globalsConstants.K_COURSE_ACTIVE_COURSE;
      this.actionActiveStr = globalsConstants.K_COURSE_ACTIVATED_STR;
      this.actionTextActiveStr = globalsConstants.K_COURSE_ACTIVE_SUCCESS_SRT;
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
        course.active = (course.active == 0) ? 1 : 0;
        this.dataApi.updateCourseById(course).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            course.active = auxActive;
            this.getCoursesByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.isLoaded = true;
            Swal.fire(
              this.actionActiveStr,
              this.actionTextActiveStr,
              'success'
            )
            if (!course.active) {
              this.coreService.createNotification(
                globalsConstants.K_MOD_COURSE, globalsConstants.K_ACTIVE_MOD, course.title,
                globalsConstants.K_ALL_USERS);
            }
            else {
              this.coreService.createNotification(
                globalsConstants.K_MOD_COURSE, globalsConstants.K_DEACTIVE_MOD, course.title,
                globalsConstants.K_ALL_USERS);
            }
          } else {
            course.active = auxActive;
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
