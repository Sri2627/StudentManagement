import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, public router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
 debugger
      this.roles = this.tokenStorage.getUser().roles;
      console.log(this.roles);

      if (this.roles[0] == "ROLE_ADMIN")  {
        
        console.log("admin there");
        this.router.navigate(['/admin']);
      }
      if (this.roles[0] == "ROLE_MODERATOR")  {
        
        console.log("mod there");
        this.router.navigate(['mod']);
      }

      if (this.roles[0] == "ROLE_USER")  {
        
        console.log("user there");
        this.router.navigate(['user']);
      }
     
      if (this.roles[0] == "ROLE_ACCOUNTS")  {
        
        console.log("user there");
        this.router.navigate(['accounthome']);
      }
      if (this.roles[0] == "ROLE_INSTITUTION")  {
        
        console.log("user there");
        this.router.navigate(['Institute']);
      }



    
      //this.router.navigate(['user']);
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        console.log(this.roles);
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
