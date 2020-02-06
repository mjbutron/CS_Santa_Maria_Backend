import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { WorkshopInterface } from 'src/app/models/workshop-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;

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
  workshopImg: string;
  inHomeChk: boolean;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Workshops - Image
  selectedImg: File;
  uploadSuccess: boolean;
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
  isEditForm = false;
  changeImage = false;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.workShopObj = new WorkshopInterface();
    this.inHomeChk = false;
  }

  ngOnInit() {
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
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

  onNewWorkshop() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.workShopObj.image = "default_image.jpg";
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditWorkshop(workShop: WorkshopInterface) {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
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

  onEditImage(){
    this.changeImage = true;
  }

  onCancelEditImage(){
    this.changeImage = false;
  }

  onSubmit(form: NgForm){
    console.log(this.workShopObj);

    if(this.isEditForm){
      console.log("Call update");
      if(this.changeImage && this.selectedImg != null){
        console.log("Call image");
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.workshopImg = img['message'];
          this.workShopObj.image = this.workshopImg;
          this.uploadSuccess = false;
          this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
            this.getWorkShopsByPage(this.page);
            this.toastr.success('Se ha actualizado el taller', 'Actualizado');
          });
        });
      } else{
        this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
          this.getWorkShopsByPage(this.page);
          this.toastr.success('Se ha actualizado el taller', 'Actualizado');
        });
      }
    } else{
      console.log("Call new");
    }

    // if(form.invalid){
    //   return;
    // }
    // this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
    //   this.sliderImg = img['message'];
    //   this.sliderObj.image = this.sliderImg;
      // this.dataApi.updateWorkshopById(this.workShopObj).subscribe((data) => {
      //   this.getWorkShopsByPage();
      //   this.onCancel();
      //   this.toastr.success('Se ha editado la cabecera', 'Actualizado');
      // });
    // });
  }

  onFileChanged($event){
    if($event != null){
      this.selectedImg = $event.target.files[0];
      if(this.selectedImg.size > K_MAX_SIZE){
        this.imageFile.nativeElement.value = K_BLANK;
        this.toastr.error('El tamaño no puede ser superior a 3MB.', 'Error');
        return;
      } else{
        this.uploadSuccess = true;
      }
    } else{
      return;
    }
  }

  onCancel(form: NgForm){
    form.reset();
    this.isEditForm = false;
    this.activeForm = false;
    this.uploadSuccess = false;
    this.changeImage = false;
  }

  scrollToDiv() {
      this.subsScrollDiv.nativeElement.scrollIntoView(true);
  }

  scrollToForm() {
      this.editWorkshop.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  toggleVisibility(e){
    this.workShopObj.home = (this.inHomeChk) ? 1 : 0;

  }
}
