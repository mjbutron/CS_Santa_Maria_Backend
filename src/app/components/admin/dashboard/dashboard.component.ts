import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  timePeriods = [
   'Título 1',
   'Título 2',
   'Título 3',
 ];

  constructor() { }

  ngOnInit() { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
    console.log(this.timePeriods);
  }

  onFileChanged($event){
    // console.log("Subida");
    // const file = event.target.files[0];
    // console.log(file.name);
  }

}
