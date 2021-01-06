import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CreateCategoryComponent } from '../templates/create-category/create-category.component';
import { data } from 'jquery';

declare var $ :any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
 
  



  constructor(
    private http: HttpClient, 
    private toastr: ToastrService
    ) { }
  
  @ViewChild(CreateCategoryComponent) viewChild: CreateCategoryComponent;
  
  editMode=false;
  
  baseUrl:string = "http://localhost:3000/api";
  categories = [];
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
  };
  ngOnInit(): void {
    this.http.get(this.baseUrl + "/categories").subscribe((data:any)=> {
      this.categories = data.categories;
    });
  }

  processForm(form : NgForm){
    this.http.post(this.baseUrl + "/categories", form.value).subscribe((data:any)=> {
      this.toastr.success("Successfully added");        
      this.ngOnInit();
    });
  }
  deleteCategory(e: { catId: string; }){
    var confirm = window.confirm("Delete this category and its childs?");
    if(confirm){
      this.http.delete(this.baseUrl + "/category/" + e.catId).subscribe({
        next: (data:any)=> {
        this.toastr.success("Successfully deleted");        
        this.ngOnInit();
      },
      error:error=>{
        (data:any)=> {error.errors = data.errors;
        }}         
    });
    }
  }
  editData: { _id: any, name: string };
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
    JSON.stringify(this.editData);
    $('#editCategoryModal').modal('show');

    console.log(this.editData);
    console.log(this.editData._id);
    console.log(this.editData.name);
   

  };

  
// isValid if(!isValid)  return;
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
          this.ngOnInit();
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


















