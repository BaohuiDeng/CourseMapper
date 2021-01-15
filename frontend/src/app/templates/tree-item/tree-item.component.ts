import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NodeModel} from '../../services/dataModels';
import { CollapseService } from '../../services/collapse.service';
import { GetCategoriesService } from '../../services/get-categories.service';

let found: boolean|object;
 found = false;
@Component({
  selector: 'app-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.css']
})
export class TreeItemComponent implements OnInit {
  //[x: string]: any;
  //categories: any;
  categories = [];
  constructor(
    private collapseService:CollapseService,
    private categoryService:GetCategoriesService
    //private CollapseStatusService:CollapseStatusService
  ) { }
  @Input() data: NodeModel;
  @Input() collapseStatus: any;
  @Output() collapseChild = new EventEmitter<any>();
  
  ngOnInit(): void { 
    console.log(this.data.subCategories)
    
  }
  collapse(el, isInit) {

    // this.CollapseStatusService.categories=this.data;
    // this.CollapseStatusService.collapseParent({el:el, isInit:isInit});
    this.collapseChild.emit({el:el, isInit:isInit});
    console.log({el:el, isInit:isInit});
    console.log(this.data);
  }
  goToDetail(categorySlug){

    window.location.href = "/courses/category/" + categorySlug;
  }
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

  collapseParent(e){
    var el = e.el;
    var isInit =e.isInit;
    var nodeId = el.substring(1);

    found = false;
    //this.categoryService.refreshData();
    console.log(this.data.subCategories);
    var pNode = this.findNode(this.data.subCategories, 'subCategories', '_id', nodeId);

    if (pNode) {
        let hide : number | boolean;
        hide = false;
        //hide = this.collapseService.toggle(nodeId);
        if (isInit === true)
        {hide = this.collapseService.isCollapsed(nodeId);}
        else
        { hide = this.collapseService.toggle(nodeId);}

        if (hide === false) {
            this.collapseStatus[nodeId] = false;
            $('#' + el).addClass('aborted');
            this.collapseService.affectVisualCat(false, pNode, pNode.slug);
        }
        else if (hide >= 0 ||hide == true) {
            this.collapseStatus[nodeId] = true;
            this.collapseService.affectVisualCat(true, pNode, pNode.slug);
            $('#' + el).removeClass('aborted');
        }

    }
}


}
