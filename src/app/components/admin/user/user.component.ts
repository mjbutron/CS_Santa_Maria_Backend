import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  // Scroll
  @ViewChild("subsScroll", { static: true }) subsScrollDiv: ElementRef;

  constructor() { }

  ngOnInit() {
    this.scrollToDiv();
  }

  scrollToDiv() {
      this.subsScrollDiv.nativeElement.scrollIntoView(true);
  }

}
