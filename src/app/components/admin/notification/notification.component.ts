import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import Swal from 'sweetalert2';
// Services
import { CoreService } from 'src/app/services/core.service';
// Interfaces
import { NotificationInterface } from 'src/app/models/notification-interface';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  // Globals
  globals: Globals;
  // Notifications
  notifyObj: NotificationInterface;
  notifications: NotificationInterface[] = [];
  // Number pages
  public numberPage: number[] = [];
  // Current page
  public page: number = 1;
  // Total pages
  public totalPages: number;
  // Total elements
  public numNotifications: number;
  // Registers
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Load
  isLoaded: boolean;
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   * @param coreService  Core service
   * @param globals      Globals
   * @param toastr       Toastr service
   */
  constructor(private coreService: CoreService, globals: Globals, public toastr: ToastrService) {
    this.globals = globals;
    this.notifyObj = new NotificationInterface();
    this.element.scrollTop = 0;
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.isLoaded = false;
    // Get all notifications
    setTimeout(() => {
      this.getNotificationsByPage(this.page);
    }, 1500);

    // Mark as notified all notifications
    setTimeout(() => {
      this.markAsNotified();
    }, 2000);

  }

  /**
   * Go to page number
   * @param page Number page
   */
  goToPage(page: number): void {
    this.page = page;
    this.getNotificationsByPage(page);
  }

  /**
   * Get notifications by page
   * @param page Number page
   */
  getNotificationsByPage(page: Number): void {
    this.coreService.getNotificationsByPage(page).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.notifications = data.allNotifications;
        this.numNotifications = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x, i) => i + 1);
        this.isLoaded = true;
      } else {
        this.numNotifications = globalsConstants.K_ZERO_RESULTS;
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Mark as notified
   */
  markAsNotified(): void {
    this.coreService.markAsNotified().subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        // Mark as notified
      }
    });
  }

  /**
   * Reload data
   */
  onReload(): void {
    this.isLoaded = false;
    this.getNotificationsByPage(this.page);
  }

  /**
   * Allows you to mark the notification as reviewed or to review
   * @param notification  Notification to mark
   */
  onReadNoRead(notification: NotificationInterface): void {
    this.isLoaded = false;
    notification.read_notification = (notification.read_notification == 0) ? 1 : 0;
    this.coreService.notificationReadNoRead(notification).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod) {
        this.getNotificationsByPage(this.page);
        this.isLoaded = true;
      } else {
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  /**
   * Delete all notifications
   */
  onDeleteAll(): void {
    Swal.fire({
      title: globalsConstants.K_NOTIF_DELETE,
      text: globalsConstants.K_WARNING_ACTION,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_CONFIRM_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        this.coreService.deleteAllNotifications().subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getNotificationsByPage(this.page);
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_DELETE_NOTIF_STR,
              data.message,
              'success'
            )
          } else {
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_ERROR_EXC_STR,
              data.message,
              'error'
            )
          }
        });
      }
    });
  }

  /**
   * Mark all notifications as read
   */
  onReadAll(): void {
    Swal.fire({
      title: globalsConstants.K_NOTIF_READ,
      text: globalsConstants.K_WARNING_ACTION,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_CONFIRM_READ_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        this.coreService.readAllNotifications().subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod) {
            this.getNotificationsByPage(this.page);
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_READ_NOTIF_STR,
              data.message,
              'success'
            )
          } else {
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_ERROR_EXC_STR,
              data.message,
              'error'
            )
          }
        });
      }
    });
  }
}
