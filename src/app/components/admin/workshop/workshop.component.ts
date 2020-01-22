import { Component, OnInit } from '@angular/core';
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

  workShops: WorkshopInterface[] = [];
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

  constructor(private dataApi: DataApiService, public toastr: ToastrService) { }

  ngOnInit() {
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

}
