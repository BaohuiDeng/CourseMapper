import { Injectable } from '@angular/core';
import { newSubCategory } from './dataModels';
@Injectable({
  providedIn: 'root'
})
export class NewSubCategoryService {

  constructor() { }
  newSubCatModel= new newSubCategory("","");
}
