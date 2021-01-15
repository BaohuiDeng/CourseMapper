import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { EditData } from './dataModels';

@Injectable({
  providedIn: 'root'
})
export class ShowEditedValueService {

  constructor() { }
  editModel= new EditData("","");


}

