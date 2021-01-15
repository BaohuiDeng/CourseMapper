import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateCategoryComponent } from '../templates/create-category/create-category.component';
import { data } from 'jquery';
import { ShowEditedValueService } from '../services/show-edited-value.service';
import { GetCategoriesService } from '../services/get-categories.service';
declare var $ :any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  editMode=false;
  
  baseUrl:string = "http://localhost:3000/api";
  categories = [];
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };
  editData: { _id: any, name: string };
  
  


  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
    public editedValue:ShowEditedValueService,
    private categoryService:GetCategoriesService
    ) { }
  
  @ViewChild(CreateCategoryComponent) viewChild: CreateCategoryComponent;
  
  ngOnInit(): void {
      this.categoryService.cast.subscribe(categories=>this.categories=categories);
      this.categoryService.refreshData();
    //console.log(this.categories);
  
}
  
  // refreshPage( categoriesInChild: any[]){
  //   this.categories=categoriesInChild;
  // }

  processForm(form : NgForm){
    // mark: httpOptions is not input in "post" request
    console.log(form.value);
    this.http.post(this.baseUrl + "/categories", form.value).subscribe(
    {
      next:(data:any)=> {
      this.toastr.success("Successfully added");        
      //this.ngOnInit();
      this.categoryService.refreshData();
    },
  
    error:error=>{(data:any)=> {error.errors = data.errors;}}
  
    }
    
);  
  };


  deleteCategory(e: { catId: string; }){
    var confirm = window.confirm("Delete this category and its childs?");
    if(confirm){
      this.http.delete(this.baseUrl + "/category/" + e.catId).subscribe({
        next: (data:any)=> {
        this.toastr.success("Successfully deleted");        
        this.categoryService.refreshData();
      },
      error:error=>{
        (data:any)=> {error.errors = data.errors;
        }}         
    });
    }
  };
  
  editCategory(e: { _id: any; name: string; }){
    
    // toggle edit mode    //-----------------------remaining to be used-------------------
    if(this.editMode){
        this.editMode = false;
        return;
    }
    this.editMode = true;
  
    this.editData = {
        _id: e._id,
        name: e.name,
      
    };
    this.editedValue.editModel=this.editData;
    
    $('#editCategoryModal').modal('show');

    console.log(this.editData);
    

  };

  
// isValid if(!isValid)  return;
  saveEditCategory = function(data: any){
   
    // this.editData = {
    //   _id: "5fed9cdcdf57d211a5af9927",
    //   name: "Super",
    // };

    this.http.put( this.baseUrl + "/category/"+this.editedValue.editModel._id,this.editedValue.editModel).subscribe(
      {
        next: (data:any)=> {
          this.toastr.success("Category edited");  
          $('#editCategoryModal').modal('hide');      
          this.categoryService.refreshData();
        },
        error:error=>{
          (data:any)=> {error.errors = data.errors;
          }}    
      }
    )
  };
  cancel = function () {
    $('#editCategoryModal').modal('hide');  
  };
  









}


















