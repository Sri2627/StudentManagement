import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { NgAnalyzeModulesHost, ThisReceiver } from '@angular/compiler';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CalendarOptions, getEventClassNames } from '@fullcalendar/angular';
import { EVENT } from 'src/app/models/event.model';
import { EventService } from 'src/app/_services/event.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { TeacherService } from '../_services/teacher.service';
import { StudentService } from '../_services/student.service';
import { SubjectService } from '../_services/subject.service';
import { SectionService } from '../_services/sections.service';
import { ContentService } from '../_services/content.service';
import { TresultService } from '../_services/tresult.service';
import { FileuploadComponent } from '../board-moderator/fileupload/fileupload.component';
import { FileUploadService } from '../_services/fileUploadService';
import { Observable } from 'rxjs';
import { FileBoxService } from '../_services/filebox.service';
import { ResultsService } from '../_services/results.service';


@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
 
 
  Events: EVENT[] = [];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
    
  };

 
  submitted = false;
  
  page: number = 1;
  count: number = 0;  
  tableSize: number= 50;
  tableSizes: any = [10, 15, 20, 50, 100];
  
  fileInfos?: Observable<any>;
  searchterm = "";
  currenteventdata: any;
  liveeventdata:any;

  event: EVENT = {
    
    title: '',
    description:'',
    date:'',
    studentid:'',
    customerid:'',
    published:false,
    createdAt:'',
  
  };
  el: any;
  noevents!: boolean;
  studentData: any;
  teacherData: any;
  subjectData: any;
  sectionData: any;
  schoolteachers: any;
  schoolstudents: any;
  schoolsubjects: any;
  schoolsections: any;
  currentexamresult: any;
  currentfileid: any;
  currentUser: any;
  currentphotourl: any;
  totalRecords: any;
  fileData: any;
  currentuserid: any;
  currentexamtitle: any;
  currentResultdata: any;
  admindata: any;
 
  selectedFiles?: FileList;
  currentFile: any;
 
  progress = 0;
  message = '';
  
  resfilename: any;
  resfilesize: any;
  resfiletype: any;

  examtitles = [
    { id: 1, title: 'Unitexam' },
    { id: 2, title: 'Quaterlyexam' },
    { id: 3, title: 'Halfyearexam' },
    { id: 4, title: 'Annualexam' },
  ];
  currentUserdata: any;
  cpassword:any;
  url:any;
  public stundentform!: FormGroup;


  constructor(private userService: UserService, 
       private eventservice :EventService,
       private httpClient: HttpClient,
       private teacherservice: TeacherService,
       private studnetservice: StudentService,
       private subjectservice :ContentService,
       private sectionservice : SectionService,
       private tresultservice :TresultService,
       private resultservice : ResultsService,
       private uploadService: FileUploadService,
       private fileboxService: FileBoxService,
       private studentservice: StudentService,
 

    private authService: AuthService, private tokenStorage: TokenStorageService, public router: Router,  public  api: ApiService ) { }
    onDateClick(res: any) {
      //alert('Clicked on date : ' + res.dateStr);
      const date = res.dateStr;
      //alert(date);
      this.getEvent(date);
   
    }
 
  ngOnInit(): void {
 
    this.currentUser = this.tokenStorage.getUser();
    this.currentuserid  =this.currentUser.id
    this.getmydetails(this.currentUser.id);

    this.retrieveEvents();
    this.retrieveTeachers();
    this.retrieveStudents();
    this.retrieveSubjects();
    this.retrieveSections();
    this.retriveReuslts();
    this.retrivetotalReuslts();

    setTimeout(() => {
      return this.httpClient
        .get('http://localhost:8080/api/events')
        .subscribe((res: any) => {
          this.Events.push(res);
          console.log(this.Events);
        });
    }, 2200);
    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        dateClick: this.onDateClick.bind(this),
       // events: this.Events,
        events: this.currenteventdata,
      };
    }, 2500);   
   


  }
  settitle(title:any){

    this.currentexamtitle = title;

   this.getmyresults(this.currentUserdata._id);


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

    this.fileboxService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });

      //this.reloadPage();
    
     
       // console.log(this.pvalue);  
     
  }
  
  
  
  getmydetails(id: string): void {
 
    this.studnetservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          
          this.getmyfiles(this.currentUser._id);
  

        },
        error: (e) => console.error(e)
      });
  }


  updateStudentDetails()
  { 
debugger
  const  userid = this.currentUser._id; 
    const data = {
           
      password : this.cpassword,
 
   
      
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

    
  retriveReuslts(){

    this.tresultservice.getAll()
    .subscribe({
      next: (data) => {
       this.currentexamresult= data;
        //this.currentexamresult = data.sort((one:any, two :any) => (Number(one.fullname) >= Number(two.fullname) ? -1 : 1));
      //this.setrank(this.currentexamresult);

       
        console.log(this.currentexamresult);

     
    
      },
      error: (e) => console.error(e)
    });
  }
  retrivetotalReuslts(){

    this.tresultservice.getAll()
    .subscribe({
      next: (data) => {
       //this.currentexamresult= data;
        this.currentexamresult = data.sort((one:any, two :any) => (Number(one.rank) >= Number(two.rank) ? 1 : -1));
      //this.setrank(this.currentexamresult);

 
        console.log(this.currentexamresult);

    
    
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

  getmyfiledetails(Fid: string, url:string){
 
    this.fileboxService.get(Fid)
    .subscribe({
      next: (data) => {
        this.currentphotourl = data.fileurl;
   
       console.log( this.currentphotourl);
        this.url =url;
       this.setprofileimage(Fid,this.url)
      
      },
      error: (e) => console.error(e)
    });
  }


    
  getmyresults(id :any ){

    debugger
       const title =  this.currentexamtitle;
    
   
         this.resultservice.findByStudent(id,title)
         .subscribe({
           next: (data) => {
             this.currentResultdata = data;
   
                 console.log(this.currentResultdata);
                 
           },
           error: (e) => console.error(e)
         });
   
        
    
   
     }

 

   
  setprofileimage(cid: string,url :any){


    this.currentfileid= this.currentUser._id; 
   
 if(this.url == 'photourl'){

  const data = {
         
    photourl : this.currentphotourl
 
    
  };

  this.studnetservice.update(this.currentfileid, data)
  .subscribe({
    next: (res) => {
      console.log(res);
      alert("Profile Photo succesfully changed");
    },
    error: (e) => console.error(e)
  });

 }

  if(this.url == 'signature'){

  const data = {
         
    signature : this.currentphotourl
 
    
  };

  this.studnetservice.update(this.currentfileid, data)
  .subscribe({
    next: (res) => {
      console.log(res);
      alert("signature succesfully changed");
    },
    error: (e) => console.error(e)
  });

 }
 else
 {
  alert("Please check the proper image");

 }
 


   

      
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
 
  getEvent ( date : any): void {
    this.eventservice.findBydate(date)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.liveeventdata = res;
          if(this.liveeventdata.length == 0){
            this.noevents = true;

          }
          else{

            this.noevents = false;
          }


        },
        error: (e) =>{
  
          console.error(e);
          alert(e.message);
        }
         
      });
  }


  retrieveTeachers(){

    this.teacherservice.getAll()
    .subscribe({
      next: (data) => {
         this.teacherData = data;
        this.schoolteachers = this.teacherData.length;
  
      },
      error: (e) => console.error(e)
    });

  }

  retrieveStudents(){

    this.studnetservice.getAll()
    .subscribe({
      next: (data) => {
         this.studentData = data;
        this.schoolstudents = this.studentData.length;
  
      },
      error: (e) => console.error(e)
    });

  }
  retrieveSubjects(){

    this.subjectservice.getAll()
    .subscribe({
      next: (data) => {
         this.subjectData = data;
        this.schoolsubjects = this.subjectData.length;
  
      },
      error: (e) => console.error(e)
    });

  }

  retrieveSections(){

    this.sectionservice.getAll()
    .subscribe({
      next: (data) => {
         this.sectionData = data;
        this.schoolsections = this.sectionData.length;
  
      },
      error: (e) => console.error(e)
    });

  }


  
}
