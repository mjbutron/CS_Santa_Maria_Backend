import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { AuthService } from 'src/app/services/auth.service';

import { DataApiService } from 'src/app/services/data-api.service';
import { Globals } from 'src/app/common/globals';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // Responsive
  isCollapsed = true;
  // Utils
  globals: Globals;
  // User
  userObj = {
    email: ""
  };

  constructor(private auth: AuthService, private dataApi: DataApiService, private coreService: CoreService, globals: Globals) {
    this.globals = globals;
  }

  ngOnInit() {
  }

  toggleSidebarPin() {
    this.coreService.toggleSidebarPin();
  }
  toggleSidebar() {
    this.coreService.toggleSidebar();
  }

  onLogout(){
    this.dataApi.logout(localStorage.getItem('email')).subscribe((data) => {
      if(this.auth.logout()){
        window.location.href = 'http://localhost:4200';
      }
    }, (err) => {
        console.log(err);
    });
  }

}
