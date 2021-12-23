import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  // Current page
  @Input() private page: number;
  // Total pages
  @Input() private totalPages: number;
  // Total elements
  @Input() public numElements: number;
  // Registers by page
  @Input() public numberPage: number;
  // Event emitter
  @Output() pageEmitter: EventEmitter<number> = new EventEmitter();

  /**
   * [constructor description]
   */
  constructor() { }

  /**
   * Initialize
   */
  ngOnInit(): void { }

  /**
   * Change next page
   */
  nextPage(): void {
    this.page++;
    this.turnPage();
  }

  /**
   * Change previous page
   */
  previousPage(): void {
    this.page--;
    this.turnPage();
  }

  /**
   * Go to the indicated page
   * @param page  Page to show
   */
  goNumberPage(page: number): void {
    this.page = page;
    this.turnPage();
  }

  /**
   * Turn page
   */
  turnPage(): void {
    this.pageEmitter.emit(this.page);
  }
}
