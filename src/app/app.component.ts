import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cssm-dashboard';

  constructor() {

  }

  // getClasses() {
  //   const classes = {
  //     'pinned-sidebar': getSidebarStat().isSidebarPinned,
  //     'toggeled-sidebar': getSidebarStat().isSidebarToggeled
  //   }
  //   return classes;
  // }
  // toggleSidebar() {
  //   this.appService.toggleSidebar();
  // }

  // getSidebarStat() {
  //   return {
  //     isSidebarPinned: this.isSidebarPinned,
  //     isSidebarToggeled: this.isSidebarToggeled
  //   }
  // }

}
