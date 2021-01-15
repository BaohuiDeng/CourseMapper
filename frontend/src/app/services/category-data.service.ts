import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { CollapseService } from './collapse.service';
import { GetCategoriesService } from './get-categories.service';
import { NodeModel} from './dataModels';
var found = false;

var i = 0;
@Injectable({
  providedIn: 'root'
})
export class CategoryDataService {
  categories = { };
  
  collapseStatus = { };
  constructor(
    private collapseService:CollapseService,
    private categoryService:GetCategoriesService
  ) { 
  }
  
  //NodeData= new NodeModel();



  findNode(obj, col, searchKey, searchValue) {
    if (found)
        return found;

    for (var i in obj) {
        var tn = obj[i];

        if (tn[searchKey] && tn[searchKey] == searchValue) {
            found = tn;
            return tn;
        }
        else if (tn[col] && tn[col].length > 0) {
            // search again
            this.findNode(tn[col], col, searchKey, searchValue);
        }
    }

    if (found)
        return found;
}


  collapseParent(e: { el: any; isInit: any}){
    var el = e.el;
    var isInit =e.isInit;
    var nodeId = el.substring(1);

    found = false;
    // this.categoryService.cast.subscribe(categories=>this.categories=categories);
    // this.categoryService.refreshData();

    var pNode = this.findNode(this.categories, 'subCategories', '_id', nodeId);
    if (pNode) {
        let hide : number | boolean;
        hide=false;
        hide = this.collapseService.toggle(nodeId);

        if (isInit === true)
            { hide = this.collapseService.isCollapsed(nodeId);}
        else
            {hide = this.collapseService.toggle(nodeId);}




        if (hide === false) {
            this.collapseStatus[nodeId] = false;
            $('#' + el).addClass('aborted');
            this.collapseService.affectVisualCat(false, pNode, pNode.slug);
        }
        else if (hide >= 0 || hide == true) {
            this.collapseStatus[nodeId] = true;
            this.collapseService.affectVisualCat(true, pNode, pNode.slug);
            $('#' + el).removeClass('aborted');
        }

    }
}










}
