import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private auth: AuthService, private coreService: CoreService, globals: Globals) {
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
    if(this.auth.logout()){
      window.location.href = 'http://localhost:4200';
    }
  }

}
