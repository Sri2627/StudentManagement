import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { TresultService } from '../_services/tresult.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  currentexamresult: any;

  constructor(private token: TokenStorageService,
              private tresultservice :TresultService,
    ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
  }



  
}



