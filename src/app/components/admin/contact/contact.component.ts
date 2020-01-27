import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
  @ViewChild("subsScroll", { static: true }) subsScrollDiv: ElementRef;
  // Errors
  errors = "";

  constructor(private dataApi: DataApiService) {
    this.infoObj = new ContactInterface();
  }

  ngOnInit() {
    this.scrollToDiv();
    this.getHomeInfo();
    this.getFooterInfo();
    this.getContactInfo();
  }

  scrollToDiv() {
      this.subsScrollDiv.nativeElement.scrollIntoView(true);
  }

  getHomeInfo(){
    this.dataApi.getInfoHome().subscribe((data) =>{
      this.infoObj.id = data[0]['id'];
      this.infoObj.home_first_ph = data[0]['home_first_ph'];
      this.infoObj.home_second_ph = data[0]['home_second_ph'];
      this.infoObj.home_fcbk = data[0]['home_fcbk'];
      this.infoObj.home_ytube = data[0]['home_ytube'];
      this.infoObj.home_insta = data[0]['home_insta'];
    }, (err) => {
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
      console.log(this.infoObj);
    }, (err) => {
      this.errors = err;
    });
  }
}
