import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MouseEvent } from '@agm/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { DataApiService } from 'src/app/services/data-api.service';
import { ContactInterface } from 'src/app/models/contact-interface';

const K_COD_OK = 200;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  // Info Obj
  infoObj: ContactInterface;
  // Scroll
  element = (<HTMLDivElement>document.getElementById("rtrSup"));
  // Coordinates
  lat = 0.0;
  lon = 0.0;
  // Load
  isLoaded: boolean;
  // Popover
  infoPopTitle = '';
  infoPopTitleTime = '';
  infoPopTitleTel = '';
  infoPopTitleEmail = '';
  homePopData = '';
  footerPopData = '';
  contactPopData = '';
  timePopData = '';
  telPopData = '';
  emailPopData = '';

  constructor(private dataApi: DataApiService, public toastr: ToastrService) {
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
    this.infoPopTitle = "Información de sección";
    this.infoPopTitleTime = "Ejemplo de horario"
    this.infoPopTitleTel = "Información de teléfonos";
    this.infoPopTitleEmail = "Información de Emails";

    this.homePopData = "En esta sección podrá indicar los números de teléfono y "
    + "redes sociales que quiere que aparezcan en la barra superior de la página web."
    this.footerPopData = "En esta sección podrá indicar la información "
    + "que quiere que aparezca en el pie de página de la página web.";
    this.contactPopData = "En esta sección podrá indicar la información "
    + "que quiere que aparezca en la sección de Contacto de la página web. Podrá seleccionar "
    + "la localización directamente haciendo click en el mapa.";
    this.timePopData = "Lunes a viernes: 09:00 - 14:00 y 17:00 - 20:00.";
    this.telPopData = "Podrá indicar varios teléfonos separandolos con ( ; ).";
    this.emailPopData = "Podrá indicar varios emails separandolos con ( ; ).";
  }

  getHomeInfo(){
    this.dataApi.getInfoHome().subscribe((data) =>{
      if (K_COD_OK == data.cod && 0 < data['homeInfo'].length){
        this.infoObj.id = data['homeInfo'][0]['id'];
        this.infoObj.home_first_ph = data['homeInfo'][0]['home_first_ph'];
        this.infoObj.home_second_ph = data['homeInfo'][0]['home_second_ph'];
        this.infoObj.home_fcbk = data['homeInfo'][0]['home_fcbk'];
        this.infoObj.home_ytube = data['homeInfo'][0]['home_ytube'];
        this.infoObj.home_insta = data['homeInfo'][0]['home_insta'];
        this.isLoaded = true;
      } else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido cargar los datos.', 'Error');
      }
    });
  }

  getFooterInfo(){
    this.dataApi.getInfoFooter().subscribe((data) =>{
      if (K_COD_OK == data.cod && 0 < data['footerInfo'].length){
        this.infoObj.footer_address = data['footerInfo'][0]['footer_address'];
        this.infoObj.footer_email = data['footerInfo'][0]['footer_email'];
        this.infoObj.footer_ph = data['footerInfo'][0]['footer_ph'];
        this.infoObj.footer_schdl = data['footerInfo'][0]['footer_schdl'];
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido cargar los datos.', 'Error');
      }
    });
  }

  getContactInfo(){
    this.dataApi.getInfoContact().subscribe((data) =>{
      if (K_COD_OK == data.cod && 0 < data['contactInfo'].length){
        this.infoObj.cnt_address = data['contactInfo'][0]['cnt_address'];
        this.infoObj.cnt_ph_appo = data['contactInfo'][0]['cnt_ph_appo'];
        this.infoObj.cnt_emails = data['contactInfo'][0]['cnt_emails'];
        this.infoObj.cnt_ph_mwives = data['contactInfo'][0]['cnt_ph_mwives'];
        this.infoObj.cnt_ph_physio = data['contactInfo'][0]['cnt_ph_physio'];
        this.infoObj.cnt_lat = data['contactInfo'][0]['cnt_lat'];
        this.infoObj.cnt_lon = data['contactInfo'][0]['cnt_lon'];
        this.lat = +this.infoObj.cnt_lat;
        this.lon = +this.infoObj.cnt_lon;
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido cargar los datos.', 'Error');
      }
    });
  }

  onSubmitHome(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoaded = false;
    this.dataApi.updateInfoHomeById(this.infoObj).subscribe((data) => {
      if (K_COD_OK == data.cod){
        this.isLoaded = true;
        this.toastr.success('Se ha actualizado la información', 'Actualizado');
      } else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
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
    this.dataApi.updateInfoFooterById(this.infoObj).subscribe((data) => {
      if (K_COD_OK == data.cod){
        this.isLoaded = true;
        this.toastr.success('Se ha actualizado la información', 'Actualizado');
      } else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
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
    this.dataApi.updateInfoContactById(this.infoObj).subscribe((data) => {
      if (K_COD_OK == data.cod){
        this.isLoaded = true;
        this.toastr.success('Se ha actualizado la información', 'Actualizado');
      } else{
        this.isLoaded = true;
        this.toastr.error('Error interno. No se ha podido realizar la acción.', 'Error');
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
