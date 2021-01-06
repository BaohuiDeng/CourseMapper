import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  constructor() { }
  @Input() data: {};
  @Output() deleteInChild = new EventEmitter<object>();
  @Output() updateInChild = new EventEmitter<object>();
  @Output() addInChild    = new EventEmitter<object>();


  baseUrl:string = "http://localhost:3000/api";

  ngOnInit(): void {
  }
  callDeleteFunction(catId: any) {
      this.deleteInChild.emit({catId:catId});
  }
  callUpdateFunction(data: object) {
      this.updateInChild.emit(data);
      console.log(data)
  }
  callAddFunction(data:object) {
    this.addInChild.emit(data);
  }
  
  









}
