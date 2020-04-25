import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/common/globals';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  // Utils
  globals: Globals;

  constructor(globals: Globals) {
    this.globals = globals;
    this.globals.user = localStorage.getItem('username');
    this.globals.rol = localStorage.getItem('rolname');
  }

  ngOnInit() {
  }

}
