import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-register',
  templateUrl: '../views/register.component.html',
  styleUrls: ['../assets/css/register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private SocialauthService: SocialAuthService
  ) {
    this.registerForm= this.formBuilder.group({
      username: [''],
      email: [''],
      password: [''],
      role: ['2']
    })
  }

  ngOnInit() { }

  registerUser() {    
    this.authService.register(this.registerForm.value).subscribe((res) => {
      this.router.navigate(['login']);
    })     

  }
  registerWithFacebook(){
    this.SocialauthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x =>{
      const currentUser = new User ();
      currentUser.username=x.name;
      currentUser.email=x.email;
      currentUser.password='';
      currentUser.role='2';
      console.log(currentUser);
      this.authService.register(currentUser).subscribe((res) => {
      this.router.navigate(['login']);
      })     
      }
    );
  }
  registerWithGoole(){
    this.SocialauthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x =>{
      const currentUser = new User ();
      currentUser.username=x.name;
      currentUser.email=x.email;
      currentUser.password='';
      currentUser.role='2';
      console.log(currentUser);
      this.authService.register(currentUser).subscribe((res) => {
      this.router.navigate(['login']);
      })     
      }
    );
  }
}