import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // Responsive
  isCollapsed = true;

  constructor(private coreService: CoreService) { }

  ngOnInit() {
  }

  toggleSidebarPin() {
    this.coreService.toggleSidebarPin();
  }
  toggleSidebar() {
    this.coreService.toggleSidebar();
  }

}
