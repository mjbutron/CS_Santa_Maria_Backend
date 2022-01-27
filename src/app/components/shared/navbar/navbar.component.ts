import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as globalsConstants from 'src/app/common/globals';
import { Globals } from 'src/app/common/globals';
// Services
import { DataApiService } from 'src/app/services/data-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // Path image
  assetsImg = environment.pathImage;
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
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param auth         Authorization service
   * @param dataApi      Data API object
   * @param coreService  Core service
   * @param toastr       Toastr service
   * @param globals      Globals
   */
  constructor(private auth: AuthService, private dataApi: DataApiService, private coreService: CoreService, public toastr: ToastrService, globals: Globals) {
    this.globals = globals;
    this.globals.userImage = localStorage.getItem(globalsConstants.K_LOGIN_STRG_USER_IMAGE);
    this.classNotifications = globalsConstants.K_NAVBAR_CLASS_BELL;

    // Check notifications
    setInterval(() => {
      if (this.globals.isAuth) {
        this.findNotifications();
      }
    }, 10000);
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.isLoading = false;
    this.hasNotifications = false;
  }

  /**
   * Change collapse right menu
   */
  changeCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * Anchor the sidebar
   */
  toggleSidebarPin(): void {
    this.coreService.toggleSidebarPin();
  }

  /**
   * Show/hide sidebar
   */
  toggleSidebar(): void {
    this.coreService.toggleSidebar();
  }

  /**
   * Log out of the user
   */
  onLogout(): void {
    this.isLoading = true;
    this.dataApi.logout(localStorage.getItem('email')).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (this.auth.logout()) {
          window.location.href = this.globals.pathFrontEnd;
        }
      } else {
        this.isLoading = false;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Find notifications
   */
  findNotifications(): void {
    this.coreService.findNotifications().subscribe(data => {
      if (globalsConstants.K_COD_OK == data.cod) {
        if (globalsConstants.K_ZERO_RESULTS < data.foundNotifications) {
          this.hasNotifications = true;
          this.classNotifications = globalsConstants.K_NAVBAR_CLASS_BELL + globalsConstants.K_NAVBAR_CLASS_EFECT_BELL;
        } else {
          this.hasNotifications = false;
          this.classNotifications = globalsConstants.K_NAVBAR_CLASS_BELL;
        }
      } else {
        this.hasNotifications = false;
        this.classNotifications = globalsConstants.K_NAVBAR_CLASS_BELL;
      }
    });
  }
}
