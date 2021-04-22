import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

import { DataApiService } from 'src/app/services/data-api.service';
import { Globals } from 'src/app/common/globals';

const K_COD_OK = 200;
const K_COD_SERVICE_UNAVBL = 503;

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
  // User
  userObj = {
    email: ""
  };

  constructor(private auth: AuthService, private dataApi: DataApiService, private coreService: CoreService, public toastr: ToastrService, globals: Globals) {
    this.globals = globals;
    this.globals.userImage = localStorage.getItem('userImage');
  }

  ngOnInit() {
    this.isLoading = false;
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
      if (K_COD_OK == data.cod){
        if(this.auth.logout()){
          window.location.href = 'http://localhost:4200';
        }
      } else{
        this.isLoading = false;
        this.toastr.error('No es posible conectar con la base de datos.', 'Error');
      }
    });
  }

}
