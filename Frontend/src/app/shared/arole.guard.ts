import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AroleGuard implements CanActivate {
 
    isLoggedIn = false;
    roles: string[] = [];
    constructor(private tokenStorageService: TokenStorageService,  public router: Router) { }
    
   
    canActivate()
      {
        this.roles = this.tokenStorageService.getUser().roles;
   
  
        if (!this.isLoggedIn) {
  
          if (this.roles[0] == "ROLE_ACCOUNTS")  {
          
            return true;
            this.router.navigate(['/accounts']);
          }
         
           
          this.router.navigate(['Unauthorized']);
          return false;
          
  
        }
        
      return true;
    } 
    
  }
  