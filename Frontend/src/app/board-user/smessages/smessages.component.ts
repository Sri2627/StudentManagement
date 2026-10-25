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
import { OrderPipe } from 'ngx-order-pipe';
import { Observable } from 'rxjs';

import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileUploadService } from 'src/app/_services/fileUploadService';
@Component({
  selector: 'app-smessages',
  templateUrl: './smessages.component.html',
  styleUrls: ['./smessages.component.css']
})
export class SmessagesComponent implements OnInit {
  currentUser: any;
 
  modaltitle!: string;
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 10;
  isLoading = false;
  tableSizes: any = [10, 15, 20, 50, 100];
  title = 'download';
  filename = 'report.xlsx';
  totalRecords: any;
  tData!: any;
  currentteacher!: any;  
  teacherid!: any;
  total!: number;
  studentData!: any;
  section: any;
  
  tutorial: Tutorial = {
    title: '',
    description: '',
    studentid: '',
   
    customerid: '',
    createdAt:'',
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
  hasmessages!: boolean;


  selectedFiles?: FileList;
  currentFile: any;
  
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  resfilename: any;
  resfilesize: any;
  resfiletype: any;
  loaderMessage: any;


  

  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private tutorialService: TutorialService, 
    private tokenStorage: TokenStorageService, 
    private uploadService: FileUploadService,
    
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
      
      this.isLoading = true;
      this.loaderMessage = 'Loading Student messages....';
      
      this.studentservice.get(id)
        .subscribe({
          next: (data) => {
            this.currentUser = data;
            this.isLoading = false;
            //console.log(data);
        
          },
          error: (e) => console.error(e)
        });
    }

    saveFile(): void {
      const data = {
             
        foldername: this.resfilename,
        name: this.resfilename,
        userid: this.currentUser._id,
        parent_id: '',
        is_folder: false,
        size: this.resfilesize,
        filetype: this.resfiletype,
        fileurl: 'http://localhost:8090/files/'+this.resfilename,
     
        
      };
    }

    selectFile(event: any): void {
      this.selectedFiles = event.target.files;
    }
  
    upload(): void {
      this.progress = 0;
  
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
  
        if (file) {
          this.currentFile = file;
          
          this.uploadService.upload(this.currentFile).subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
     
                
                this.fileInfos = this.uploadService.getFiles();
                var res =  event.body;
                console.log(event.body);
                // Converting JSON-encoded string to JS object
                var obj = JSON.parse(res.body);
                this.resfilename = obj[0].filename;
           
                this.resfilesize = obj[0].size;
                this.resfiletype = obj[0].contentType;
  
                this.saveFile();
              }
            },
            error: (err: any) => {
              console.log(err);
              this.progress = 0;
  
              if (err.error && err.error.message) {
                this.message = err.error.message;
              } else {
                this.message = 'Could not upload the file!';
              }
  
              this.currentFile = undefined;
            },
          });
        }
  
        this.selectedFiles = undefined;
      }
    }
  
   
    searchTitle(): void {
      this.currentTutorial = {};
      this.currentIndex = -1;
   
      this.tutorial.studentid  = this.customerid;
      this.tutorialService.findByStudentid(this.customerid)
        .subscribe({
          next: (data) => {
            this.tutorials = data;
            this.totalRecords=this.tutorials.length;
            console.log(data);
            if(this.totalRecords > 0){
              this.hasmessages = true;
  
            }
            else
            {
              this.hasmessages = false;
  
            }
          
            

          },
          error: (e) => console.error(e)
        });
        this.tutorials?.sort();
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
      
      this.tutorialService.get(id)
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


  
}