import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../public/app/controllers/login.component';
import { RegisterComponent } from '../public/app/controllers/register.component';
import { UserProfileComponent } from '../public/app/controllers/user-profile.component';
import {EmployeeComponent} from '../employee/employee.component'

import { AuthGuard } from "../auth.guard";


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'Homepage', component:EmployeeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }