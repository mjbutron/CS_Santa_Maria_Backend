import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as globalsConstants from 'src/app/common/globals';
import { Globals } from 'src/app/common/globals';
// Services
import { CoreService } from './services/core.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataApiService } from 'src/app/services/data-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Globals
  globals: Globals;
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param coreService  Core service
   * @param globals      Globals
   * @param dataApi      Data API object
   */
  constructor(private coreService: CoreService, globals: Globals, private dataApi: DataApiService) {
    this.globals = globals;
  }

  /**
   * Get style classes for the sidebar
   * @return Array with style classes
   */
  getClasses() {
    const classes = {
      'pinned-sidebar': this.coreService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.coreService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }

  /**
   * Show/hide sidebar
   */
  toggleSidebar() {
    this.coreService.toggleSidebar();
  }
}
