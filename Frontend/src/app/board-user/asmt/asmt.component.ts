import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { StudentService } from '../../_services/student.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { UserService } from '../../_services/user.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { Students } from '../../models/student.model';
import { map } from 'rxjs/operators';

import {NgxPaginationModule, PaginationService} from 'ngx-pagination'
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Ng2OrderModule } from 'ng2-order-pipe';
import * as XLSX  from 'xlsx';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { ASMTService } from 'src/app/_services/asmt.service';
import { ASMT } from 'src/app/models/asmt.model';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  selector: 'app-asmt',
  templateUrl: './asmt.component.html',
  styleUrls: ['./asmt.component.css']
})
export class AsmtComponent implements OnInit {
  currentUser: any;
  
  teacherid: any;
  modaltitle!: string;
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 10;
  tableSizes: any = [10, 15, 20, 50, 100];
  title = 'download';
  filename = 'report.xlsx';
  totalRecords: any;
  tData!: any;
  currentteacher!: any;  
  
  total!: number;
  studentData!: any;
  section: any;
  
  tutorial: ASMT = {
    title: '',
    description: '',
    studentid: '',
   
    customerid: '',
    createdAt:'',
    published: false
  };
  submitted = false;
  students?: Students[];
  tutorials?: ASMT[];
  sids?: any;
  currentTutorial: ASMT = {};
  currentIndex = -1;
  customerid = '';
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  SortbyParam = '';
  SortDirection = 'asc';
  hasassignments!: boolean;

  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private tutorialService: TutorialService, 
    private asmtservice: ASMTService,
    private tokenStorage: TokenStorageService, 
    public router: Router) { }
 
 
  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();
   


    this.getmydetails(this.currentUser.id);
    
    this.tutorial.customerid  = this.customerid;
    this.section = this.currentUser.section;
    console.log(   this.section );
    console.log(   this.currentUser );

    this.customerid = this.currentUser.id;
    console.log(   this.customerid );
    this.searchTitle();
 
   
  }
 

    getmydetails(id: string): void {
      
      this.studentservice.get(id)
        .subscribe({
          next: (data) => {
            this.currentUser = data;
       
            //console.log(data);
        
          },
          error: (e) => console.error(e)
        });
    }

    
    getmyteacherdetails(id: string): void {
      
      this.studentservice.get(id)
        .subscribe({
          next: (data) => {
            this.currentteacher = data.fullname;
       
            console.log( this.currentteacher);
        
          },
          error: (e) => console.error(e)
        });
    }

    

    

    
  
    
    searchTitle(): void {
      this.currentTutorial = {};
      this.currentIndex = -1;
   
      this.tutorial.studentid  = this.customerid;
      this.asmtservice.findByStudentid(this.customerid)
        .subscribe({
          next: (data) => {
            this.tutorials = data;
            this.totalRecords=this.tutorials.length;
            console.log(data);
            this.currentTutorial =this.tutorials[this.totalRecords-1];


            if(this.totalRecords > 0){
              this.hasassignments = true;

            }
            else
            {
              this.hasassignments = false;

            }
            
          },
          error: (e) => console.error(e)
        });
        
    }
  
  
    
     
  
     onTableDataChange( event: any){
     
      this.page = event;
      this.searchTitle();
    }
    onTableSizeChange( event: any){
      this.tableSize= event.target.value;
      this.page = 1;
      this.searchTitle();
    }
   
     

    
    getmessage(id: string): void {
      
      this.asmtservice.get(id)
        .subscribe({
          next: (data) => {
            this.currentTutorial = data;;
            this.teacherid = this.currentTutorial.customerid;
            this.getmyteacherdetails( this.teacherid);
            //console.log(data);
        
          },
          error: (e) => console.error(e)
        });
    }

    

  
}