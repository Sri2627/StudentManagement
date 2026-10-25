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
import * as XLSX  from 'xlsx';
import { TutorialService } from 'src/app/_services/tutorial.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  currentUser: any;
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
  pvalue:any;
  total!: number;
  studentData!: any;
  section: any;
  
  tutorial: Tutorial = {
    title: '',
    description: '',
    studentid: '',
    
    customerid: '',
    published: false
  };
  submitted = false;
  students?: Students[];
  tutorials?: Tutorial[];
  sids?: any;
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  customerid = '';
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  mrecords!:any
  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private tutorialService: TutorialService, 
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

  
       
    getmystudents(section: string): void {
      debugger
      this.studentservice.findByCustmerid(section)
        .subscribe({
          next: (data) => {
            this.currentUser = data;
            this.studentData = data.sort((one:any, two :any) => (one.admissionno > two.admissionno ? 1 : -1));
          this.studentData = data;
          //  this.totalRecords=this.studentData.length;
            this.mrecords=this.studentData.length;
            this.students = data;
            this.sids = data.map( (item) => item._id);
           
          },
          error: (e) => console.error(e)
        });
    }
 
    sendmessage(): void{
 
      this.section = this.currentUser.section;
      this.getmystudents(this.section);
      const length = this.mrecords;
     
      for(let j=0;j<length;j++){   
      
  
        const data = {
          title: this.tutorial.title,
          description: this.tutorial.description,
          customerid:this.customerid ,
          studentid:this.sids[j]
        };
    
        this.tutorialService.create(data)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.submitted = true;
            },
            error: (e) => console.error(e)
          });
    
         }  
  
        // this.reloadPage();
      }
  
     

    

  
    saveTutorial(): void {
      const data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
        service: this.tutorial.studentid,
        customerid:this.customerid 
      };
  
      this.tutorialService.create(data)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.submitted = true;
          },
          error: (e) => console.error(e)
        });
  
        window.location.reload();

      
       
         // console.log(this.pvalue);  
       
    }
  
    newTutorial(): void {
      this.submitted = false;
      this.tutorial = {
        title: '',
        description: '',
        studentid: '',
        customerid:'',
        published: false
      };
    }
  
    
    retrieveTutorials(): void {
      this.tutorialService.getAll()
        .subscribe({
          next: (data) => {
            this.tutorials = data;
            console.log(data);
          },
          error: (e) => console.error(e)
        });
    }
  
    refreshList(): void {
      this.retrieveTutorials();
      this.currentTutorial = {};
      this.currentIndex = -1;
    }
  
    setActiveTutorial(tutorial: Tutorial, index: number): void {
      this.currentTutorial = tutorial;
      this.currentIndex = index;
      
     
    }
  
    removeAllTutorials(): void {
      this.tutorialService.deleteAll()
        .subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e)
        });
    }
  
    searchTitle(): void {
      this.currentTutorial = {};
      this.currentIndex = -1;
   
      this.tutorial.customerid  = this.customerid;
      this.tutorialService.findByCustmerid(this.customerid)
        .subscribe({
          next: (data) => {
            this.tutorials = data;
            this.findsum(this.tutorials);  
            this.totalRecords=this.tutorials.length;
            console.log(data);
          },
          error: (e) => console.error(e)
        });
    }
  
  
    
    exportExcel(): void{
  
      let element = document.getElementById('download');
  
      const ws:XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
      const wb:XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1});
  
      XLSX.utils.book_append_sheet(wb,ws,'Sheet1')
      XLSX.writeFile(wb,this.filename)
  
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
   
    findsum(data:any[]){    
 
      this.pvalue=data;
      this.total = 0;
     // console.log(this.pvalue);  
      for(let j=0;j<data.length;j++){   
         this.total =  this.total+Number(this.pvalue[j].price);
         console.log(this.total)  
      }  
  }
  reloadPage(): void {
    window.location.reload();
  }

   

}