import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShowEditedValueService } from '../../services/show-edited-value.service';
import { NewSubCategoryService } from "../../services/new-sub-category.service";
import { GetCategoriesService } from '../../services/get-categories.service';
declare var $ :any;
@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent implements OnInit{
  editDataSub: { parentCategory: string; name: string; };
  

  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
    public editedValue:ShowEditedValueService,
    public newSubCat: NewSubCategoryService,
    private categoryService:GetCategoriesService
    ) { }
  @Input() data: {};

  @Output() deleteInChild = new EventEmitter<object>();
  @Output() updateInChild = new EventEmitter<object>();
  @Output() addInChild    = new EventEmitter<object>();
  @Output() dataChangeDetection = new EventEmitter<object>();
  @Output("parentFunDelete") parentFunDelete:EventEmitter<any> =new EventEmitter();


  baseUrl:string = "http://localhost:3000/api";

 

   editData: { _id: any, name: string };
   editMode=false;
  ngOnInit(): void {
    
  }


  dataChangeFunction(){
    //   this.http.get(this.baseUrl + "/categories").subscribe((data:any)=> {
    //     this.dataChangeDetection.emit(data.categories);
    //     console.log(data.categories);
    // });
    
    this.categoryService.refreshData();
    

  }

  callDeleteFunction(catId: any) {
      this.deleteInChild.emit({catId:catId});
      console.log({catId:catId})
  }
  callUpdateFunction(data: object) {
      this.updateInChild.emit(data);
      console.log(data)
  }
  

  


  deleteCategory(e: { catId: string; }){
    var confirm = window.confirm("Delete this category and its childs?");
    if(confirm){
      this.http.delete(this.baseUrl + "/category/" + e.catId).subscribe({
        next: (data:any)=> {
        this.toastr.success("Successfully deleted");  
        this.dataChangeFunction();
        
        
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

  saveEditCategory = function(data: any){
   
    // this.editData = {
    //   _id: "5fed9cdcdf57d211a5af9927",
    //   name: "Super",
    // };
    
    this.http.put( this.baseUrl + "/category/"+this.editData._id,this.editData).subscribe(
      {
        next: (data:any)=> {
          this.toastr.success("Category edited");  
          $('#editCategoryModal').modal('hide');      
          this.dataChangeFunction();
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












  processForm(form : NgForm){

    // this.editDataSub = {
    //   parentCategory: "5fc012bf4570ba0bd5a965f4",
    //   name: "SuperSpiderMan",
    // };

    this.editDataSub = {
      parentCategory: form.value.parent,
      name: form.value.category,
    };
    this.newSubCat.newSubCatModel=this.editDataSub


    console.log(form.value);
    console.log(form.value.parent);
    console.log(this.newSubCat.newSubCatModel)
    console.log(this.newSubCat.newSubCatModel.parentCategory);
    console.log(this.newSubCat.newSubCatModel.name);
    // mark: httpOptions is not input in "post" request



    this.http.post(this.baseUrl + "/categories",this.editDataSub).subscribe(
    {
      next:(data:any)=> {
      this.toastr.success("Successfully added");        
      this.dataChangeFunction();
    },
  
    error:error=>{
      (data:any)=> {error.errors = data.errors;
      }}
  
    }
    
    
    );
  };

  


  
  









}
