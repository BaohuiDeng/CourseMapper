import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TreeItemComponent } from './templates/tree-item/tree-item.component';
import { FooterComponent } from './include/footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoryComponent } from './category/category.component';
import { CreateCategoryComponent } from './templates/create-category/create-category.component';
import { FormsModule,FormBuilder,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


import { CourseComponent } from './course/course.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
//import { GetCategoriesService} from './services/get-categories.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TreeItemComponent,
    FooterComponent,
    NavbarComponent,
    CategoryComponent,
    CreateCategoryComponent,
    CourseComponent,
    SignupComponent,
    LoginComponent,
    ProfileComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
