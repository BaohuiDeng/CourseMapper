import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { CourseComponent } from './course/course.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import {SignupComponent} from './signup/signup.component';
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'courses/category/:slug', component: CourseComponent},
  {path :'accounts/signup',component:SignupComponent},
  // {path:'accounts/login/#?referer=signUp&result=success',component:LoginComponent},
  {path:'accounts/:username',component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
