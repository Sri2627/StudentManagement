import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ASMT } from 'src/app/models/asmt.model';
import { ASMTService } from 'src/app/_services/asmt.service';
import { AuthService } from 'src/app/_services/auth.service';
import { StudentService } from 'src/app/_services/student.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';
import { Tutorial } from 'src/app/models/tutorial.model'; 

import { map } from 'rxjs/operators';

import {NgxPaginationModule, PaginationService} from 'ngx-pagination'
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as XLSX  from 'xlsx';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { Students } from 'src/app/models/student.model';
import { FileBoxService } from 'src/app/_services/filebox.service';
import { FileUploadService } from 'src/app/_services/fileUploadService';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {

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
  tutorials?: ASMT[];
  sids?: any;
  currentTutorial: ASMT = {};
  currentIndex = -1;
  customerid = '';
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  fileData: any;
  currentphotourl:any;
  currentfileid: any;
  
 
  selectedFiles?: FileList;
  currentFile: any;
  
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  resfilename: any;
  resfilesize: any;
  resfiletype: any;

  
  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private fileboxService: FileBoxService,
    private tutorialService: TutorialService, 
    private uploadService: FileUploadService,
    private tokenStorage: TokenStorageService, 
    private asmtService: ASMTService,
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
      this.section = this.currentUser.section;
      this.studentservice.findByCustmerid(section)
        .subscribe({
          next: (data) => {
          
            console.log("sriaknth");
            console.log(data);
            console.log(this.section);
            this.studentData = data;
            this.totalRecords=this.studentData.length;
            this.students = data;
            this.sids = data.map( (item) => item._id);
       
            console.log(this.sids);
          },
          error: (e) => console.error(e)
        });
    }

 
    sendassignments(): void{
    
      this.section = this.currentUser.section;
      this.getmystudents(this.section);
      const length = this.totalRecords;
      console.log(this.studentData.length);
      console.log(length);
  
      for(let j=0;j<length;j++){   
  
        const data = {
          title: this.tutorial.title,
          description: this.tutorial.description,
          customerid:this.customerid ,
          attachedurl: 'http://localhost:8090/files/'+this.resfilename,
          studentid:this.sids[j]
        };
    
        this.asmtService.create(data)
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
  
      this.asmtService.create(data)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.submitted = true;
          },
          error: (e) => console.error(e)
        });
  
 
      
       
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
      this.asmtService.getAll()
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
      this.asmtService.deleteAll()
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
      this.asmtService.findByCustmerid(this.customerid)
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


  
  getmyfiles(userid: string): void {
      
    this.fileboxService.findByStudentid(userid)
      .subscribe({
        next: (data) => {
       
          this.fileData = data;
         this.totalRecords=this.fileData.length;
        // this.students = data;
        //  this.sids = data.map( (item) => item._id);
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
 
       
  getmychildren(pid: string ){

    let cuserid = this.currentUser._id;

    this.fileboxService.findBypatentid(cuserid,pid)
    .subscribe({
      next: (data) => {
     
        this.fileData = data;
       this.totalRecords=this.fileData.length;
      // this.students = data;
      //  this.sids = data.map( (item) => item._id);
        console.log(data);
      },
      error: (e) => console.error(e)
    });

  }

  getdetails(cfilename: string){

    this.uploadService.getFile(cfilename)
    .subscribe({
      next: (res) => {
        console.log(res);

        
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



  getmyfiledetails(Fid: string){

    this.fileboxService.get(Fid)
    .subscribe({
      next: (data) => {
        this.currentphotourl = data.fileurl;
   
       console.log( this.currentphotourl);

       this.setprofileimage(Fid)
      
      },
      error: (e) => console.error(e)
    });
  }




 
  setprofileimage(cid: string){
  

    this.currentfileid= this.currentUser._id; 
   
    console.log( this.currentphotourl);
    const data = {
         
      photourl : this.currentphotourl
   
      
    };

  }


}