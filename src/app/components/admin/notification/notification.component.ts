import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import Swal from 'sweetalert2';

import { CoreService } from 'src/app/services/core.service';

import { NotificationInterface } from 'src/app/models/notification-interface';

// Constants
const K_DELETE_NOTIFICATIONS = '¿Seguro que deseas eliminar todas las notificaciones?';
const K_READ_NOTIFICATIONS = '¿Seguro que deseas marcar todas las notificaciones como revisadas?';
const K_WARNING_ACTION = 'Atención: Esta acción no se puede deshacer.';

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
  // Numeros páginas
  public numberPage: number[] = [];
  // Página actual
  public page: number = 1;
  // Total de paginas
  public totalPages: number;
  // Total de elementos
  public numNotifications: number;
  // Elementos por página
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Load
  isLoaded: boolean;

  constructor(private coreService: CoreService, globals: Globals, public toastr: ToastrService) {
    this.globals = globals;
    this.notifyObj = new NotificationInterface();
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.isLoaded = false;
    // Get all notifications
    setTimeout (() => {
      this.getNotificationsByPage(this.page);
    }, 1500);

    // Mark as notified all notifications
    setTimeout (() => {
      this.markAsNotified();
    }, 2000);

  }

  goToPage(page: number){
    this.page = page;
    this.getNotificationsByPage(page);
  }

  getNotificationsByPage(page: Number) {
    this.coreService.getNotificationsByPage(page).subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod){
        this.notifications = data.allNotifications;
        this.numNotifications = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else{
        this.numNotifications = globalsConstants.K_ZERO_RESULTS;
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  markAsNotified() {
    this.coreService.markAsNotified().subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod){
        // Notified
      } else{
        // Error
      }
    });
  }

  onReload(){
    this.getNotificationsByPage(this.page);
  }

  onReadNoRead(notification: NotificationInterface){
    this.isLoaded = false;
    notification.read_notification = (notification.read_notification == 0) ? 1 : 0;
    this.coreService.notificationReadNoRead(notification).subscribe((data) => {
      if (globalsConstants.K_COD_OK == data.cod){
        this.getNotificationsByPage(this.page);
        this.isLoaded = true;
        // this.toastr.success(data.message, globalsConstants.K_UPDATE_STR);
      } else{
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onDeleteAll(){
    Swal.fire({
      title: K_DELETE_NOTIFICATIONS,
      text: K_WARNING_ACTION,
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
          if (globalsConstants.K_COD_OK == data.cod){
            this.getNotificationsByPage(this.page);
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_DELETE_NOTIF_STR,
              data.message,
              'success'
            )
          } else{
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

  onReadAll(){
    Swal.fire({
      title: K_READ_NOTIFICATIONS,
      text: K_WARNING_ACTION,
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
          if (globalsConstants.K_COD_OK == data.cod){
            this.getNotificationsByPage(this.page);
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_READ_NOTIF_STR,
              data.message,
              'success'
            )
          } else{
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
