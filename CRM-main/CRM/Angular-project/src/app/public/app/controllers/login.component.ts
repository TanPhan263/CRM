import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from "@angular/forms";

import { AuthService } from '../services/auth.service';

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../assets/css/login.component.css']
})

export class LoginComponent implements OnInit {
//social login
//basic login
  loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private SocialauthService: SocialAuthService
  ) {
    this.loginForm= this.formBuilder.group({
      email: [''],
      password: ['']
    })
  }

  ngOnInit() { }

  loginUser() {
    this.authService.login(this.loginForm.value)
  }
  registerUser() {
    this.router.navigate(['register']);
  }
  signInWithGoogle(): void {
    this.SocialauthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      const currentUser = new User ();
      currentUser.username=x.name;
      currentUser.email=x.email;
      currentUser.password='';
      currentUser.role='2';
      console.log(currentUser);
      try{
        this.authService.register(currentUser).subscribe((res) => {
          alert(res);
        });     
        this.authService.login(currentUser)
        }
        catch{ this.authService.login(currentUser)}
        }
    );

      
  }

  signInWithFB(): void {
    this.SocialauthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x =>{
      const currentUser = new User ();
      currentUser.username=x.name;
      currentUser.email=x.email;
      currentUser.password='';
      currentUser.role='2';
      console.log(currentUser);
      try{
      this.authService.register(currentUser).subscribe((res) => {
        alert(res)
      });     
      this.authService.login(currentUser)
      }
      catch{ this.authService.login(currentUser)}
      }
    );
  }
  loginFacebook(){
    this.authService.loginFacebook();
  }


}