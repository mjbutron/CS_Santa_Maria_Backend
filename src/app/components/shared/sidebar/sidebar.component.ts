import { Component, OnInit } from '@angular/core';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  // Globals
  globals: Globals;
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param globals  Globals
   */
  constructor(globals: Globals) {
    this.globals = globals;
    this.globals.user_name = localStorage.getItem(globalsConstants.K_LOGIN_STRG_USER_NAME);
    this.globals.rol_name = localStorage.getItem(globalsConstants.K_LOGIN_STRG_ROL_NAME);
    this.globals.userImage = localStorage.getItem(globalsConstants.K_LOGIN_STRG_USER_IMAGE);
  }

  /**
   * Initialize
   */
  ngOnInit(): void { }
}
