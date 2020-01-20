import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() private page: number;
  @Input() private totalPages: number;
  @Input() public numElements: number;
  @Input() public numberPage: number;
  @Output() pageEmitter: EventEmitter<number> =  new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  nextPage(){
    this.page++;
    this.turnPage();
  }

  previousPage(){
    this.page--;
    this.turnPage();
  }

  goNumberPage(page: number){
    this.page = page;
    this.turnPage();
  }

  turnPage(){
    this.pageEmitter.emit(this.page);
  }
}
