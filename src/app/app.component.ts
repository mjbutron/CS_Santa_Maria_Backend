import { Component } from '@angular/core';
import { CoreService } from './services/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cssm-dashboard';

  constructor(private coreService: CoreService) {}

  getClasses() {
    const classes = {
      'pinned-sidebar': this.coreService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.coreService.getSidebarStat().isSidebarToggeled
    }
    return classes;
  }
  toggleSidebar() {
    this.coreService.toggleSidebar();
  }

}
