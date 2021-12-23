import { Component, OnInit } from '@angular/core';
import * as globalsConstants from 'src/app/common/globals';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  // Year
  year: number;
  // Global Constants
  globalCnstns = globalsConstants;

  /**
   * Constructor
   */
  constructor() {
    this.year = new Date().getFullYear();
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
  }
}
