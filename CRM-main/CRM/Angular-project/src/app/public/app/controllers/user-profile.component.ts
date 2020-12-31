import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SocialAuthService } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";


@Component({
  selector: 'app-user-profile',
  templateUrl: '../views/user-profile.component.html',
  styleUrls: ['../assets/css/user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  user: SocialUser;
  loggedIn: boolean;
  currentUser: {
    createdAt:'',
    _id: '',
    username:'',
    email: '',
    password: ''
};

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private SocialauthService: SocialAuthService
  ) {
    let id = localStorage.getItem('access_token')
    this.authService.getUserProfile(id).subscribe(res => {
      this.currentUser = res;
      this.currentUser=JSON.parse(this.currentUser.toString());
    })
  }

  ngOnInit() {
    this.SocialauthService.authState.subscribe((user) => {
    this.user = user;
    this.loggedIn = (user != null);
    console.log(this.user);
  });}
}
