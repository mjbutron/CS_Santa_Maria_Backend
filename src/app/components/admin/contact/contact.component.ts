import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MouseEvent } from '@agm/core';
import { ToastrService } from 'ngx-toastr';

import { DataApiService } from 'src/app/services/data-api.service';
import { ContactInterface } from 'src/app/models/contact-interface';

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
  // Errors
  errors = "";
  // Coordinates
  lat = 0.0;
  lon = 0.0;
  // Load
  isLoaded: boolean;

  constructor(private dataApi: DataApiService, public toastr: ToastrService) {
    this.infoObj = new ContactInterface();
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.isLoaded = false;
    this.getHomeInfo();
    this.getFooterInfo();
    this.getContactInfo();
  }

  getHomeInfo(){
    this.dataApi.getInfoHome().subscribe((data) =>{
      this.infoObj.id = data[0]['id'];
      this.infoObj.home_first_ph = data[0]['home_first_ph'];
      this.infoObj.home_second_ph = data[0]['home_second_ph'];
      this.infoObj.home_fcbk = data[0]['home_fcbk'];
      this.infoObj.home_ytube = data[0]['home_ytube'];
      this.infoObj.home_insta = data[0]['home_insta'];
      // Temporal - comprobar carga de datos y reintentos
      setTimeout (() => {
           this.isLoaded = true;
        }, 1000);
    }, (err) => {
      this.isLoaded = false;
      this.errors = err;
    });
  }

  getFooterInfo(){
    this.dataApi.getInfoFooter().subscribe((data) =>{
      this.infoObj.footer_address = data[0]['footer_address'];
      this.infoObj.footer_email = data[0]['footer_email'];
      this.infoObj.footer_ph = data[0]['footer_ph'];
      this.infoObj.footer_schdl = data[0]['footer_schdl'];
    }, (err) => {
      this.errors = err;
    });
  }

  getContactInfo(){
    this.dataApi.getInfoContact().subscribe((data) =>{
      this.infoObj.cnt_address = data[0]['cnt_address'];
      this.infoObj.cnt_ph_appo = data[0]['cnt_ph_appo'];
      this.infoObj.cnt_emails = data[0]['cnt_emails'];
      this.infoObj.cnt_ph_mwives = data[0]['cnt_ph_mwives'];
      this.infoObj.cnt_ph_physio = data[0]['cnt_ph_physio'];
      this.infoObj.cnt_lat = data[0]['cnt_lat'];
      this.infoObj.cnt_lon = data[0]['cnt_lon'];
      this.lat = +this.infoObj.cnt_lat;
      this.lon = +this.infoObj.cnt_lon;
    }, (err) => {
      this.errors = err;
    });
  }

  onSubmitHome(form: NgForm){
    if(form.invalid){
      return;
    }
    this.dataApi.updateInfoHomeById(this.infoObj).subscribe((data) => {
      this.toastr.success('Se ha actualizado la información', 'Actualizado');
    }, (err) => {
      this.toastr.error('No se ha podido actualizar la información', 'Ups!');
    });
  }

  onResetHome(form: NgForm){
    form.reset();
  }

  onSubmitFooter(form: NgForm){
    if(form.invalid){
      return;
    }
    this.dataApi.updateInfoFooterById(this.infoObj).subscribe((data) => {
      this.toastr.success('Se ha actualizado la información', 'Actualizado');
    }, (err) => {
      this.toastr.error('No se ha podido actualizar la información', 'Ups!');
    });
  }

  onResetFooter(form: NgForm){
    form.reset();
  }

  onSubmitContact(form: NgForm){
    if(form.invalid){
      return;
    }
    this.dataApi.updateInfoContactById(this.infoObj).subscribe((data) => {
      this.toastr.success('Se ha actualizado la información', 'Actualizado');
    }, (err) => {
      this.toastr.error('No se ha podido actualizar la información', 'Ups!');
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
