import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';

import { DataApiService } from 'src/app/services/data-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';
import { Globals } from 'src/app/common/globals';

// Constants
const K_CLASS_BELL = 'far fa-bell ';
const K_CLASS_EFECT_BELL = 'animate__animated animate__swing ';

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
  isLoading = false;
  hasNotifications = false;
  classNotifications: string;
  // User
  userObj = {
    email: ""
  };

  constructor(private auth: AuthService, private dataApi: DataApiService, private coreService: CoreService, public toastr: ToastrService, globals: Globals) {
    this.globals = globals;
    this.globals.userImage = localStorage.getItem('userImage');
    this.classNotifications = K_CLASS_BELL;

    // Check notifications
    setInterval (() => {
      if(this.globals.isAuth){
        this.findNotifications();
      }
    }, 10000);
  }

  ngOnInit() {
    this.isLoading = false;
    this.hasNotifications = false;
  }

  toggleSidebarPin() {
    this.coreService.toggleSidebarPin();
  }
  toggleSidebar() {
    this.coreService.toggleSidebar();
  }

  onLogout(){
    this.isLoading = true;
    this.dataApi.logout(localStorage.getItem('email')).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod){
        if(this.auth.logout()){
          window.location.href = this.globals.pathFrontEnd;
        }
      } else{
        this.isLoading = false;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  findNotifications(){
    this.coreService.findNotifications().subscribe(data => {
      if (globalsConstants.K_COD_OK == data.cod){
        if(globalsConstants.K_ZERO_RESULTS < data.foundNotifications){
          this.hasNotifications = true;
          this.classNotifications = K_CLASS_BELL + K_CLASS_EFECT_BELL;
        }else{
          this.hasNotifications = false;
          this.classNotifications = K_CLASS_BELL;
        }
      } else{
        this.hasNotifications = false;
        this.classNotifications = K_CLASS_BELL;
      }
    });
  }

}
