import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { FileUploadService } from '../_services/fileUploadService';
import { StudentService } from '../_services/student.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FILEBOX } from '../models/filebox.model';
import { FileBoxService } from '../_services/filebox.service';
import { OrderPipe } from 'ngx-order-pipe';
import{Students} from'../models/student.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/angular';
import { TutorialService } from '../_services/tutorial.service';
import { EventService } from '../_services/event.service';
import { ResultsService } from '../_services/results.service';

 

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
 
  currentUser: any;
  totalRecords: any;
 
  selectedFiles?: FileList;
 
  fileData: any;

 
  currentFile?: File;
  progress = 0;
  message = '';
  eventfile:any;
  fileInfos?: Observable<any>;
 
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 50;
  tableSizes: any = [10, 15, 20, 50, 100];
  currentfileid: any;
  currentphotourl?: String;
  currentfile:any;
  submitted = false;
  resfilename: any;
  resfilesize: any;
  resfiletype: any;

  isSuccessful = false;
  isSignUpFailed = false;
 
  student ?: Students[];
  

  
  editForm: any = {
    fullname: null,
    mobile: null,
    email: null,
    address: null,
    password: null,
  };
  file: FILEBOX = {
   
    name: '',
    size: '',
    userid: '',
    parent_id: '',
    fileurl: '',
    foldername: '',
    filetype: '',
    is_folder: false


  };

 
  calendarOptions: CalendarOptions = {
    headerToolbar: {
 
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
    
  };

  public stundentform!: FormGroup;
  studentModelObj: Students = new Students;
  studentData!: any;
  currentTutorial!: {};
  currentIndex!: number;
  tutorials:any;
  currenteventdata: any;
  currentevent: any;
  currenmessage: any;
  currentmessagetid: any;
  currentteacher!: String;
  currentexamtitle: any;
  currentResultdata: any;
  admindata: any;
  currentUserdata!: Students;
  rdata!: any[];
  total!: number;
  totalmarks!: number;
 
  
  constructor(private userService: UserService, 
    private formbuilder: FormBuilder,
    private studentservice:StudentService, 
    private authService: AuthService, 
    private eventservice : EventService,
    private resultservice : ResultsService,
    private tutorialService :TutorialService,
    private uploadService: FileUploadService,
    private tokenStorage: TokenStorageService, 
    private fileboxService: FileBoxService,
    private orderPipe: OrderPipe,
    public router: Router) { }
 
 
  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();

    this.getmydetails(this.currentUser.id);

    this.stundentform = this.formbuilder.group({
      fullname:[''],
      email:[''],
      mobile:[''],
      address:[''],
      password:[''],
       
    })
    this.getmydetails(this.currentUser.id)
    this.retrivemessages(this.currentUser.id);
    this.retrieveEvents();
  }
 
selectFile(event: any): void {
  this.selectedFiles = event.target.files;
}


  getmydetails(id: string): void {
 
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          this.currentUserdata =  data;
          this.getmyfiles(this.currentUser._id);
 
        //  console.log(this.currentUser.admissionno, this.currentUser.email,this.currentUser.mobile,this.currentUser.address);

          this.stundentform.controls['fullname'].setValue(this.currentUser.fullname);
          this.stundentform.controls['email'].setValue(this.currentUser.email);
          this.stundentform.controls['mobile'].setValue(this.currentUser.mobile);
          this.stundentform.controls['address'].setValue(this.currentUser.address);
         },
        error: (e) => console.error(e)
      });
  }

  updateStudentDetails()
  { 

  const  userid = this.currentUser._id; 
    const data = {
           
      password : this.stundentform.value.password,
 
   
      
    }
 
    this.studentservice.changepassword(userid, data)
    .subscribe({
      next: (res) => {
        console.log(res);
        alert("user data updated succesfully");
      },
      error: (e) => console.error(e)
    });


     // this.reloadPage();

  }

 
  settitle(title:any){

    this.currentexamtitle = title;

   this.getmyresults(this.currentUser._id);


  }

  getmyresults(examtitle :any ){

    debugger
       const title =  examtitle;
    
   
         this.resultservice.findByStudent(this.currentUser._id,title)
         .subscribe({
           next: (data) => {
             this.currentResultdata = data;
   
                 console.log(this.currentResultdata);
                  this.findsum(this.currentResultdata);
        //this.getadmindetails();
           },
           error: (e) => console.error(e)
         });
   
        
    
   
     }

     findsum(data:any[]){    
      debugger
      this.rdata = data;
      this.total = 0;
      this.totalmarks = 0;
     // console.log(this.pvalue);  
      for(let j=0;j<data.length;j++){   
         this.total =  this.total+Number(this.rdata[j].totalmarks);
         this.totalmarks =  this.totalmarks+Number(this.rdata[j].marksobtained);
        
         console.log(this.total)  
      }  
  }
  
     
  getadmindetails(){

    const adminid ="62d6a4026ae6ff3978d9d7a9";
    this.studentservice.get(adminid)
    .subscribe({
      next: (data) => {
        this.admindata = data;
 
       
      },
      error: (e) => console.error(e)
    });

  }
 

  

     
     
   // Getter to access form control
   get myForm() {
    return this.editForm.controls;
  }
  onSubmit() {}


    getmyfiles(userid: string): void {
      
      this.fileboxService.findByStudentid(userid)
        .subscribe({
          next: (data) => {
         
            this.fileData = data;
           this.totalRecords=this.fileData.length;
          // this.students = data;
          //  this.sids = data.map( (item) => item._id);
          //  console.log(data);
          },
          error: (e) => console.error(e)
        });
    }
    onTableDataChange( event: any){
     
      this.page = event;
      this.getmyfiles(this.currentUser._id);
    }
    onTableSizeChange( event: any){
      this.tableSize= event.target.value;
      this.page = 1;
      this.getmyfiles(this.currentUser._id);
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
  
    retrieveEvents(): void {
    
      this.eventservice.getAll()
        .subscribe({
          next: (data) => {
  
            this.currenteventdata = data;
           
        
            console.log(data);
          },
          error: (e) => console.error(e)
        });
    }

    retrivemessages(id :any): void {
      debugger
      this.currentTutorial = {};
      this.currentIndex = -1;
   
       this.tutorialService.findByStudentid(id)
        .subscribe({
          next: (data) => {
            this.tutorials = data.sort((one:any, two :any) => (one.createdAt > two.createdAt ? -1 : 1));
    
            this.currenmessage = this.tutorials[0];
            this.currentmessagetid =  this.tutorials[0].customerid;
            console.log(data);
           this.getmyteacherdetails(this.currentmessagetid );
            

          },
          error: (e) => console.error(e)
        });
        this.tutorials?.sort();
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

      this.studentservice.update(this.currentfileid, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert("Profile Photo succesfully changed");
        },
        error: (e) => console.error(e)
      });


        this.reloadPage();
  }


     
    
    reloadPage(): void {
      window.location.reload();
    }
  
  

  
}
