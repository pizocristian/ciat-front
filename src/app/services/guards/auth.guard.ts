import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators'
import Cookies from 'universal-cookie/es6';

const cookies = new Cookies();

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {  
  constructor(private authSvc: AuthService, private router: Router, private AFauth: AngularFireAuth) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
     
      //Desición para permitir acceso a los Tabs
      if(!cookies.get('token')){
        this.router.navigateByUrl('/login');     
        return false;
      }else{
        return true;  
      }    
    
      
      
  }
  
  
}
