import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MouseEvent } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { ContactInterface } from 'src/app/models/contact-interface';

// Constants
const K_INFO_POP_TITLE = "Información de sección";
const K_INFO_POP_TITLE_TIME = "Ejemplo de horario"
const K_INFO_POP_TITLE_EMAIL = "Información de Emails";
const K_HOME_POP_DATA = "En esta sección podrá indicar los números de teléfono y "
+ "redes sociales que quiere que aparezcan en la barra superior de la página web."
const K_FOOTER_POP_DATA = "En esta sección podrá indicar la información "
+ "que quiere que aparezca en el pie de página de la página web.";
const K_CONTACT_POP_DATA = "En esta sección podrá indicar la información "
+ "que quiere que aparezca en la sección de Contacto de la página web. Podrá seleccionar "
+ "la localización directamente haciendo click en el mapa.";
const K_TIME_POP_DATA = "Lunes a viernes: 09:00 - 14:00 y 17:00 - 20:00.";
const K_EMAIL_POP_DATA = "Podrá indicar varios emails separandolos con ( ; ).";
const K_INFO_EMAIL_POP_DATA = "El email indicado aquí es donde se recibiran las consultas e inscripciones de la web.";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  // Globals
  globals: Globals;
  // Info Obj
  infoObj: ContactInterface;
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
  infoEmailPopData ='';

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService, globals: Globals) {
    this.globals = globals;
    this.infoObj = new ContactInterface();
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.isLoaded = false;
    this.populatePopData();
    this.getHomeInfo();
    this.getFooterInfo();
    this.getContactInfo();
  }

  populatePopData(){
    this.infoPopTitle = K_INFO_POP_TITLE;
    this.infoPopTitleTime = K_INFO_POP_TITLE_TIME;
    this.infoPopTitleEmail = K_INFO_POP_TITLE_EMAIL;

    this.homePopData = K_HOME_POP_DATA;
    this.footerPopData = K_FOOTER_POP_DATA;
    this.contactPopData = K_CONTACT_POP_DATA;
    this.timePopData = K_TIME_POP_DATA;
    this.emailPopData = K_EMAIL_POP_DATA;
    this.infoEmailPopData = K_INFO_EMAIL_POP_DATA;
  }

  getHomeInfo(){
    this.dataApi.getInfoHome().subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod && 0 < data.homeInfo.length){
        for(let i = 0; i < data.homeInfo.length; i++){
          this.infoObj.id = data.homeInfo[i].id;
          this.infoObj.home_first_ph = data.homeInfo[i].home_first_ph;
          this.infoObj.home_second_ph = data.homeInfo[i].home_second_ph;
          this.infoObj.home_fcbk = data.homeInfo[i].home_fcbk;
          this.infoObj.home_ytube = data.homeInfo[i].home_ytube;
          this.infoObj.home_insta = data.homeInfo[i].home_insta;
        }
        this.isLoaded = true;
      } else{
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  getFooterInfo(){
    this.dataApi.getInfoFooter().subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod && 0 < data.footerInfo.length){
        for(let i = 0; i < data.footerInfo.length; i++){
          this.infoObj.footer_address = data.footerInfo[i].footer_address;
          this.infoObj.footer_email = data.footerInfo[i].footer_email;
          this.infoObj.footer_ph = data.footerInfo[i].footer_ph;
          this.infoObj.footer_schdl = data.footerInfo[i].footer_schdl;
        }
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  getContactInfo(){
    this.dataApi.getInfoContact().subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod && 0 < data.contactInfo.length){
        for(let i = 0; i < data.contactInfo.length; i++){
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

  onSubmitHome(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoaded = false;
    this.infoObj.user_id = this.globals.userID;
    this.dataApi.updateInfoHomeById(this.infoObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod){
        this.isLoaded = true;
        this.coreService.createNotification(
          globalsConstants.K_MOD_INFO, globalsConstants.K_UPDATE_MOD, globalsConstants.K_MOD_INFO_HOME,
          globalsConstants.K_ALL_USERS);
        this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
      } else{
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onResetHome(form: NgForm){
    form.reset();
  }

  onSubmitFooter(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoaded = false;
    this.infoObj.user_id = this.globals.userID;
    this.dataApi.updateInfoFooterById(this.infoObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod){
        this.isLoaded = true;
        this.coreService.createNotification(
          globalsConstants.K_MOD_INFO, globalsConstants.K_UPDATE_MOD, globalsConstants.K_MOD_INFO_FOOTER,
          globalsConstants.K_ALL_USERS);
        this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
      } else{
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onResetFooter(form: NgForm){
    form.reset();
  }

  onSubmitContact(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoaded = false;
    this.infoObj.user_id = this.globals.userID;
    this.dataApi.updateInfoContactById(this.infoObj).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod){
        this.isLoaded = true;
        this.coreService.createNotification(
          globalsConstants.K_MOD_INFO, globalsConstants.K_UPDATE_MOD, globalsConstants.K_MOD_INFO_CONTACT,
          globalsConstants.K_ALL_USERS);
        this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
      } else{
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onResetContact(form: NgForm){
    form.reset();
  }

  // Maps
  mapClicked($event: MouseEvent) {
    this.lat = $event.coords.lat;
    this.lon = $event.coords.lng;
    this.infoObj.cnt_lat = this.lat.toString();
    this.infoObj.cnt_lon = this.lon.toString();
  }

}
