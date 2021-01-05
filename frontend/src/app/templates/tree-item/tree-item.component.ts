import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.css']
})
export class TreeItemComponent implements OnInit {

  constructor() { }
  @Input() data: {};
  @Input() collapseStatus;
  @Output() collapseChild = new EventEmitter<any>();

  ngOnInit(): void {
    
  }
  collapse(el, isInit) {
    this.collapseChild.emit({el:el, isInit:isInit});
  }
  goToDetail(categorySlug){
    window.location.href = "/courses/category/" + categorySlug;
  }
}
