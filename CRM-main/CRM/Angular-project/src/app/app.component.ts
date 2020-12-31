import { Component } from '@angular/core';
import { AuthService } from './public/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-project';
  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout()
  }
}
