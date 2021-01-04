import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TreeItemComponent } from './templates/tree-item/tree-item.component';
import { FooterComponent } from './include/footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoryComponent } from './category/category.component';
import { CreateCategoryComponent } from './templates/create-category/create-category.component';
import { FormsModule,FormBuilder,FormGroup } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { CourseComponent } from './course/course.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TreeItemComponent,
    FooterComponent,
    NavbarComponent,
    CategoryComponent,
    CreateCategoryComponent,
    CourseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    
    
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
