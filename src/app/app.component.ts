import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from './services/core.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataApiService } from 'src/app/services/data-api.service';

import { Globals } from 'src/app/common/globals';

// Constants
const K_TITLE_STR = 'cssm-dashboard';
const K_PINNED_SDB = 'pinned-sidebar';
const K_TOGGELED_SDB = 'toggeled-sidebar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = K_TITLE_STR;
  globals: Globals;

  constructor(private coreService: CoreService, globals: Globals, private dataApi: DataApiService) {
    this.globals = globals;
  }

  getClasses() {
    const classes = {
      K_PINNED_SDB: this.coreService.getSidebarStat().isSidebarPinned,
      K_TOGGELED_SDB: this.coreService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }

  toggleSidebar() {
    this.coreService.toggleSidebar();
  }
}
