import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TroleGuard implements CanActivate {
  isLoggedIn = false;
  roles: string[] = [];
  constructor(private tokenStorageService: TokenStorageService,  public router: Router) { }
  
 
  canActivate(): boolean {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.roles = this.tokenStorageService.getUser().roles || [];
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
      return false;
    }
    if (!this.roles.includes("ROLE_MODERATOR")) {
      this.router.navigate(['Unauthorized']);
      return false;
    }
    return true;
  }
  
}
