import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { AuthService } from "./public/app/services/auth.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot, 
    UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class AuthInterceptor implements HttpInterceptor {
    constructor(  public authService: AuthService,
        public router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const accessToken = this.authService.getAccessToken();
        req = req.clone({
            setHeaders: {
                Authorization: `JWT $[accessToken}` 
            }
        });
        return next.handle(req);
    }
}