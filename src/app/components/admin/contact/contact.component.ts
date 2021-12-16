import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MouseEvent } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
// Services
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { ContactInterface } from 'src/app/models/contact-interface';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  // Globals
  globals: Globals;
  // Contact information
  infoObj: ContactInterface;
  inSocialChk: boolean;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Coordinates
  lat = 0.0;
  lon = 0.0;
  // Load
  isLoaded: boolean;
  // Popover
  infoPopTitle = '';
  infoPopTitleTime = '';
  infoPopTitleEmail = '';
  homePopData = '';
  footerPopData = '';
  contactPopData = '';
  timePopData = '';
  emailPopData = '';
  infoEmailPopData = '';
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
    this.infoObj = new ContactInterface();
    this.element.scrollTop = 0;
    this.inSocialChk = false;
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.isLoaded = false;
    this.populatePopData();
    this.getHomeInfo();
    this.getFooterInfo();
    this.getContactInfo();
  }

  /**
   * Filling pop-ups
   */
  populatePopData(): void {
    this.infoPopTitle = globalsConstants.K_INFO_POP_TITLE;
    this.infoPopTitleTime = globalsConstants.K_INFO_POP_TITLE_TIME;
    this.infoPopTitleEmail = globalsConstants.K_INFO_POP_TITLE_EMAIL;

    this.homePopData = globalsConstants.K_HOME_POP_DATA;
    this.footerPopData = globalsConstants.K_FOOTER_POP_DATA;
    this.contactPopData = globalsConstants.K_CONTACT_POP_DATA;
    this.timePopData = globalsConstants.K_TIME_POP_DATA;
    this.emailPopData = globalsConstants.K_EMAIL_POP_DATA;
    this.infoEmailPopData = globalsConstants.K_INFO_EMAIL_POP_DATA;
  }

  /**
   * Get information from the Home section
   */
  getHomeInfo(): void {
    this.dataApi.getInfoHome().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod && 0 < data.homeInfo.length) {
        for (let i = 0; i < data.homeInfo.length; i++) {
          this.infoObj.id = data.homeInfo[i].id;
          this.infoObj.home_first_ph = data.homeInfo[i].home_first_ph;
          this.infoObj.home_second_ph = data.homeInfo[i].home_second_ph;
          this.infoObj.home_fcbk = data.homeInfo[i].home_fcbk;
          this.infoObj.home_ytube = data.homeInfo[i].home_ytube;
          this.infoObj.home_insta = data.homeInfo[i].home_insta;
        }
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Get information from the Footer section
   */
  getFooterInfo(): void {
    this.dataApi.getInfoFooter().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod && 0 < data.footerInfo.length) {
        for (let i = 0; i < data.footerInfo.length; i++) {
          this.infoObj.footer_address = data.footerInfo[i].footer_address;
          this.infoObj.footer_email = data.footerInfo[i].footer_email;
          this.infoObj.footer_ph = data.footerInfo[i].footer_ph;
          this.infoObj.footer_schdl = data.footerInfo[i].footer_schdl;
          this.inSocialChk = (data.footerInfo[i].footer_social_links == 1) ? true : false;
        }
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Get information from the Contact section
   */
  getContactInfo(): void {
    this.dataApi.getInfoContact().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod && 0 < data.contactInfo.length) {
        for (let i = 0; i < data.contactInfo.length; i++) {
          this.infoObj.cnt_address = data.contactInfo[i].cnt_address;
          this.infoObj.cnt_ph_appo = data.contactInfo[i].cnt_ph_appo;
          this.infoObj.cnt_emails = data.contactInfo[i].cnt_emails;
          this.infoObj.cnt_ph_mwives = data.contactInfo[i].cnt_ph_mwives;
          this.infoObj.cnt_ph_physio = data.contactInfo[i].cnt_ph_physio;
          this.infoObj.cnt_lat = data.contactInfo[i].cnt_lat;
          this.infoObj.cnt_lon = data.contactInfo[i].cnt_lon;
        }
        this.lat = +this.infoObj.cnt_lat;
        this.lon = +this.infoObj.cnt_lon;
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Submit form information to create or edit Home information
   * @param form  Form with the information
   */
  onSubmitHome(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.isLoaded = false;
    this.infoObj.user_id = this.globals.userID;
    this.dataApi.updateInfoHomeById(this.infoObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.isLoaded = true;
        this.coreService.createNotification(
          globalsConstants.K_MOD_INFO, globalsConstants.K_UPDATE_MOD, globalsConstants.K_MOD_INFO_HOME,
          globalsConstants.K_ALL_USERS);
        this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Reset Home form
   * @param form  Form to be cleaned
   */
  onResetHome(form: NgForm): void {
    form.reset();
  }

  /**
   * Submit form information to create or edit Footer information
   * @param form  Form with the information
   */
  onSubmitFooter(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isLoaded = false;
    this.infoObj.user_id = this.globals.userID;
    this.dataApi.updateInfoFooterById(this.infoObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.isLoaded = true;
        this.coreService.createNotification(
          globalsConstants.K_MOD_INFO, globalsConstants.K_UPDATE_MOD, globalsConstants.K_MOD_INFO_FOOTER,
          globalsConstants.K_ALL_USERS);
        this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Reset Footer form
   * @param form  Form to be cleaned
   */
  onResetFooter(form: NgForm): void {
    form.reset();
  }

  /**
   * Submit form information to create or edit Contact information
   * @param form  Form with the information
   */
  onSubmitContact(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.isLoaded = false;
    this.infoObj.user_id = this.globals.userID;
    this.dataApi.updateInfoContactById(this.infoObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.isLoaded = true;
        this.coreService.createNotification(
          globalsConstants.K_MOD_INFO, globalsConstants.K_UPDATE_MOD, globalsConstants.K_MOD_INFO_CONTACT,
          globalsConstants.K_ALL_USERS);
        this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Reset Contact form
   * @param form  Form to be cleaned
   */
  onResetContact(form: NgForm): void {
    form.reset();
  }

  /**
   * Show and hide social links in the footer
   * @param e  Event
   */
  toggleVisibility(e): void{
    this.infoObj.footer_social_links = (this.inSocialChk) ? 1 : 0;
  }

  /**
   * Get coordinates marked on the map
   * @param $event  Event click
   */
  mapClicked($event: MouseEvent): void {
    this.lat = $event.coords.lat;
    this.lon = $event.coords.lng;
    this.infoObj.cnt_lat = this.lat.toString();
    this.infoObj.cnt_lon = this.lon.toString();
  }
}
