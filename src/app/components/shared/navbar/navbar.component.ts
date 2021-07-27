import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';

import { DataApiService } from 'src/app/services/data-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';
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
  isLoading = false;
  hasNotifications = false;
  // User
  userObj = {
    email: ""
  };

  constructor(private auth: AuthService, private dataApi: DataApiService, private coreService: CoreService, public toastr: ToastrService, globals: Globals) {
    this.globals = globals;
    this.globals.userImage = localStorage.getItem('userImage');

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
        }else{
          this.hasNotifications = false;
        }
      } else{
        this.hasNotifications = false;
      }
    });
  }

}
