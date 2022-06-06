import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
// Services
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { SliderInterface } from 'src/app/models/slider-interface';
import { ServiceInterface } from 'src/app/models/service-interface';
import { WorkshopInterface } from 'src/app/models/workshop-interface';
import { CourseInterface } from 'src/app/models/course-interface';
import { OpinionInterface } from 'src/app/models/opinion-interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Globals
  globals: Globals;
  // Path
  path = environment.imageRootPath;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editHeader", { static: false }) editHeader: ElementRef;
  // Form
  disabledForm = true;
  @ViewChild('cssmFile', { static: false }) imageFile: ElementRef;
  // Slider - Image
  selectedImg: File;
  uploadSuccess: boolean;
  progress: number = 0;
  changeImage = false;
  // Slider
  sliderObj: SliderInterface;
  sliderImg: string;
  // Slider - Carrousel
  sliders: SliderInterface[] = [];
  // Service
  services: ServiceInterface[] = [];
  numSrv: number;
  isLastSrv = false;
  lastDateSrv: string;
  // Workshop
  wspInHome: WorkshopInterface[] = [];
  numWsp: number;
  isNextWsp = false;
  nextDateWsp: string;
  noDate = globalsConstants.K_NO_DATE_STR;
  // Course
  course: CourseInterface[] = [];
  numCrs: number;
  isNextCrs = false;
  nextDateCrs: string;
  // Opinions
  opnInHome: OpinionInterface[] = [];
  numOpn: number;
  isLastOpn = false;
  nextDateOpn: string;
  // Load
  isLoaded: boolean;
  // Today date
  todayDate = formatDate(new Date(), globalsConstants.K_FORMAT_DATE, globalsConstants.K_LOCALE_EN);
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param dataApi      Data API object
   * @param toastr       Toastr service
   * @param coreService  Core service object
   * @param globals      Globals
   */
  constructor(private dataApi: DataApiService,
    public toastr: ToastrService,
    private coreService: CoreService,
    globals: Globals) {
    this.globals = globals;
    this.sliderObj = new SliderInterface();
    this.element.scrollTop = 0;
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.uploadSuccess = false;
    this.changeImage = false;
    this.isLoaded = false;
    this.getAllServices();
    this.getAllWorkshops();
    this.getAllSlider();
    this.getAllCourses();
    this.getAllOpinions();
  }

  /**
   * Get all services for superior cards
   */
  getAllServices(): void {
    this.dataApi.getAllServices().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (0 < data.allServices.length) {
          this.services = data.allServices;
          this.numSrv = data.allServices.length;
          this.lastDateSrv = this.services[0].create_date;
          this.isLastSrv = true;
        }
        else {
          this.isLastSrv = false;
          this.numSrv = globalsConstants.K_ZERO_RESULTS;
          this.lastDateSrv = globalsConstants.K_NO_DATE;
        }
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Get al workshop for superior cards
   */
  getAllWorkshops(): void {
    this.dataApi.getAllWorkshops().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (0 < data.allWorkshops.length) {
          for (let wspHome of data.allWorkshops) {
            if (wspHome.home == 1) {
              this.wspInHome.push(wspHome);
            }
          }
          this.numWsp = data.allWorkshops.length;
          for (let wspDate of data.allWorkshops) {
            if (!this.isNextWsp && this.todayDate < wspDate.session_date) {
              this.isNextWsp = true;
              this.nextDateWsp = wspDate.session_date;
              break;
            }
          }
          if (!this.isNextWsp) {
            this.nextDateWsp = globalsConstants.K_NO_DATE;
          }
        }
        else {
          this.isNextWsp = false;
          this.numWsp = globalsConstants.K_ZERO_RESULTS;
          this.nextDateWsp = globalsConstants.K_NO_DATE;;
        }
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Get all sliders
   */
  getAllSlider(): void {
    this.dataApi.getAllSlider().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.sliders = data.allSliders;
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Get all courses for superior cards
   */
  getAllCourses(): void {
    this.dataApi.getAllCourses().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (0 < data.allCourses.length) {
          this.course = data.allCourses;
          this.numCrs = data.allCourses.length;
          for (let crsDate of data.allCourses) {
            if (!this.isNextCrs && this.todayDate < crsDate.session_date) {
              this.isNextCrs = true;
              this.nextDateCrs = crsDate.session_date;
              break;
            }
          }
          if (!this.isNextCrs) {
            this.nextDateCrs = globalsConstants.K_NO_DATE;
          }
        }
        else {
          this.isNextCrs = false;
          this.numCrs = globalsConstants.K_ZERO_RESULTS;
          this.nextDateCrs = globalsConstants.K_NO_DATE;
        }
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Get all opinions for superior cards
   * @return [description]
   */
  getAllOpinions() {
    this.dataApi.getAllOpinions().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (0 < data.allOpinions.length) {
          for (let opnHome of data.allOpinions) {
            if (opnHome.home == 1) {
              this.opnInHome.push(opnHome);
            }
          }
          this.numOpn = data.allOpinions.length;
          this.nextDateOpn = data.allOpinions[0].create_date;
          this.isLastOpn = true;
        }
        else {
          this.isLastOpn = false;
          this.numOpn = globalsConstants.K_ZERO_RESULTS;;
          this.nextDateOpn = globalsConstants.K_NO_DATE;;
        }
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Allows drag and drop on the header image
   * @param event  DragDrop event
   */
  drop(event: CdkDragDrop<SliderInterface[]>): void {
    this.isLoaded = false;
    moveItemInArray(this.sliders, event.previousIndex, event.currentIndex);
    let index = 1;
    let canContinue = 0;
    let error = false;
    for (let slider of this.sliders) {
      this.dataApi.updateOrderSlider(slider, index).subscribe((data) => {
        if (globalsConstants.K_COD_OK != data.cod) {
          error = true;
        }
        canContinue++;

        if (!error && 3 == canContinue) {
          this.isLoaded = true;
          this.toastr.success(globalsConstants.K_DASHBRD_UPDATE_ORDER, globalsConstants.K_UPDATE_STR);
        }
        if (error && 3 == canContinue) {
          this.isLoaded = true;
          this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
        }
      });
      index++;
    }
  }

  /**
   * Activate the image editing form and set the values
   * @param slider  Slider to modify
   */
  onSlider(slider: SliderInterface): void {
    this.changeImage = false;
    this.sliderObj.image = (slider.image) ? slider.image : globalsConstants.K_DEFAULT_IMAGE;
    this.sliderImg = slider.image;
    this.disabledForm = false;

    setTimeout(() => {
      this.sliderObj.id = slider.id;
      this.sliderObj.title = slider.title;
      this.sliderObj.description = slider.description;
      this.sliderObj.order_slider = slider.order_slider;
      this.sliderObj.color_text = slider.color_text;
      this.scrollToForm();
    }, 200);
  }

  /**
   * Cancel edit slider
   */
  onCancel(): void {
    this.sliderObj.id = 0;
    this.sliderObj.title = globalsConstants.K_BLANK;
    this.sliderObj.description = globalsConstants.K_BLANK;
    this.imageFile.nativeElement.value = globalsConstants.K_BLANK;
    this.sliderObj.order_slider = 0;
    this.sliderObj.color_text = globalsConstants.K_SLIDER_TEXT_COLOR;
    this.sliderObj.image = globalsConstants.K_BLANK;
    this.uploadSuccess = false;
    this.disabledForm = true;
  }

  /**
   * Submit form information to create or edit slider
   * @param form Form with the information
   */
  onSubmit(form: NgForm): void {
    this.isLoaded = false;
    if (form.invalid) {
      this.isLoaded = true;
      return;
    }
    if (this.changeImage && this.selectedImg != null) {
      this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
        this.sliderImg = img['message'];
        this.sliderObj.image = this.sliderImg;
        this.uploadSuccess = false;
        this.dataApi.updateSliderById(this.sliderObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getAllSlider();
            this.disabledForm = true;
            this.onCancel();
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
          } else {
            this.isLoaded = true;
            this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
          }
        });
      });
    }
    else {
      this.dataApi.updateSliderById(this.sliderObj).subscribe((data) => {
        if (globalsConstants.K_COD_OK == data.cod) {
          this.getAllSlider();
          this.disabledForm = true;
          this.onCancel();
          this.isLoaded = true;
          this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
        } else {
          this.isLoaded = true;
          this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
        }
      });
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
        this.changeImage = false;
        this.toastr.error(globalsConstants.K_ERROR_SIZE, globalsConstants.K_ERROR_STR);
        return;
      } else {
        for (let i = 0; i <= 100; i++) {
          setTimeout(() => {
            this.progress = i;
          }, 500);
        }
        this.changeImage = true;
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
   * Scroll to form
   */
  scrollToForm(): void {
    this.editHeader.nativeElement.scrollIntoView({ behavior: "smooth" });
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
