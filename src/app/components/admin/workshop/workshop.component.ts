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

  constructor(private dataApi: DataApiService, public toastr: ToastrService) { }

  ngOnInit() {
    this.getAllWorkshops();
  }

  getAllWorkshops(){
    this.dataApi.getAllWorkshops()
    .subscribe((allWorkshops: WorkshopInterface[]) => {
      this.workShops = allWorkshops;
    }, (err) => {
      this.errors = err;
    });
  }

}
