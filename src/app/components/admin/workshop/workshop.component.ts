import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { DataApiService } from 'src/app/services/data-api.service';

import { WorkshopInterface } from 'src/app/models/workshop-interface';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {

  // Path
  path = "http://localhost/apiRest/uploads/";
  // Workshops
  workShopObj: WorkshopInterface;
  workShops: WorkshopInterface[] = [];
  inHomeChk: boolean;
  // Errors
  errors = "";
  // Numeros páginas
  public numberPage: number[] = [];
  // Página actual
  public page: number = 1;
  // Total de paginas
  public totalPages: number;
  // Total de elementos
  public numWorkShops: number;
  // Elementos por página
  private numResults: number = 10;
  // Scroll
  @ViewChild("subsScroll", { static: true }) subsScrollDiv: ElementRef;
  // Scroll Form
  @ViewChild("editWorkshop", { static: true }) editWorkshop: ElementRef;
  // Form
  activeForm = false;
  populateForm = false;

  constructor(private dataApi: DataApiService, public toastr: ToastrService) {
    this.workShopObj = new WorkshopInterface();
    this.inHomeChk = false;
  }

  ngOnInit() {
    this.activeForm = false;
    this.populateForm = false;
    this.scrollToDiv();
    this.getWorkShopsByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getWorkShopsByPage(page);
  }

  getAllWorkshops(){
    this.dataApi.getAllWorkshops()
    .subscribe((allWorkshops: WorkshopInterface[]) => {
      this.workShops = allWorkshops;
    }, (err) => {
      this.errors = err;
    });
  }

  getWorkShopsByPage(page: Number) {
    this.dataApi.getWorkShopsByPage(page).subscribe((data) =>{
        this.workShops = data['allWorkshops'];
        this.numWorkShops = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
    });
  }

  onEditWorkshop(workShop: WorkshopInterface) {
    // Habilitar form en formato eedición
    this.activeForm = true;
    // Setear valores al ui
    this.workShopObj.id = workShop.id;
    this.workShopObj.home = workShop.home;
    this.inHomeChk = (workShop.home == 1) ? true : false;
    this.workShopObj.title = workShop.title;
    this.workShopObj.description_home = workShop.description_home;
    this.workShopObj.image = workShop.image;
    this.workShopObj.subtitle = workShop.subtitle;
    this.workShopObj.price = workShop.price;
    this.workShopObj.address = workShop.address;
    this.workShopObj.session_date = workShop.session_date;
    console.log(workShop.session_date);

    this.workShopObj.session_start = workShop.session_start;
    this.workShopObj.session_end = workShop.session_end;
    this.workShopObj.sessions = workShop.sessions;
    this.workShopObj.description = workShop.description;
    this.workShopObj.user_id = workShop.user_id;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  scrollToDiv() {
      this.subsScrollDiv.nativeElement.scrollIntoView(true);
  }

  scrollToForm() {
      this.editWorkshop.nativeElement.scrollIntoView({behavior:"smooth"});
  }
}
