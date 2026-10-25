import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
 
import { PaginationService } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { EXAMS } from 'src/app/models/exams.model';
import { RESULTS } from 'src/app/models/results.model';
import { AuthService } from 'src/app/_services/auth.service';
import { ExamsService } from 'src/app/_services/exams.service';
import { ExamtitlesService } from 'src/app/_services/examtitles.service';
import { FileUploadService } from 'src/app/_services/fileUploadService';
import { ResultsService } from 'src/app/_services/results.service';
import { StudentService } from 'src/app/_services/student.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';


@Component({
  selector: 'app-studentexams',
  templateUrl: './studentexams.component.html',
  styleUrls: ['./studentexams.component.css']
})
export class StudentexamsComponent implements OnInit {
  public stunderform!: FormGroup;
  
  studentData!: any;
  isLoggedIn = false;
  showSave!: boolean;
  showUpdate!:boolean;
  modaltitle!: string;
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 10;
  tableSizes: any = [10, 15, 20, 50, 100];
 
  totalRecords: any;

  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  ispassed: any;
  isattended:any;
  isconducted:any;

  exams?: EXAMS[];
  currentExam: EXAMS = {
 
  };
  
  exam: EXAMS = {
    
    title: '',
    date: '',
    subject: '',
    syllabus: '',
    customerid: '',
    section: '',
    published: false
  };
  submitted = false;
  currentResult : RESULTS= {
    examid : '',
    studentid: '',
    studentname: '',
    totalmarks: '',
    marksobtained: '',
    attachmenturl: '',
    totalattended: '',
    rank: '',
 
  }
 
  currentIndex = -1;
  currentUser!:any;
  currentUserdata!:any;
  currentsection!:any;
  hasexams!: boolean;
  currentresults: any;
  marks!: any[];
  currentResultdata:any;
  total!: number;
  rdata!: any[];
  totalmarks!: number;
  percentage!: number;

  examtitles:any;
  currentexamtitle: any;
  admindata:any;
  


  constructor(private studentservice: StudentService, 
    public router: Router, 
    private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder,
    private resultservice: ResultsService,
    private authService:AuthService, 
    private examservice: ExamsService, 
    private examtitleservice: ExamtitlesService,
    private uploadService:FileUploadService,
     public paginate: PaginationService) { }

  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();
    this.getadmindetails();
    this.getmydetails(this.currentUser.id);
 
    this.getmyresults(this.currentUser.id);
    this.retrieveexamstitles();
  }

  getmydetails(id: string): void {
      
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUserdata = data;
          this.currentsection =this.currentUserdata.section
        this.searchExams(this.currentsection);
         
        },
        error: (e) => console.error(e)
      });
  }
  

  
  retrieveexamstitles(): void {
    
    this.examtitleservice.getAll()
      .subscribe({
        next: (data) => {
          
          this.examtitles = data;
       
       
      
        },
        error: (e) => console.error(e)
      });
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
 
  getresults(eid : string, sid:string){

    debugger
    console.log(eid);
    console.log(sid);

    this.examservice.get(eid).subscribe({
      next:(data)=>{
        this.currentExam = data;
        this.isconducted = this.currentExam.published;
        
      }

    });

    this.resultservice.findByStudentid(eid,sid)
    .subscribe({
      next: (data) => {
        this.currentResult = data;
        this.ispassed = this.currentResult.ispassed;
        this.isattended = this.currentResult.ispassed
      console.log(this.currentResult.studentid);

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
              this.findsum(this.currentResultdata);
               this.getadmindetails();
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

searchtitleExams( title: any): void {
 debugger
  const section = this.currentsection;
 this.currentexamtitle = title;
    this.examservice.findBycategory(section,title)
      .subscribe({
        next: (data) => {
        
          this.exams = data.sort((one:any, two :any) => (one.date > two.date ? 1 : -1));
 
          console.log(this.exams);
          this.totalRecords=this.exams.length;
  
          if(this.totalRecords > 0){
            this.hasexams = true;

          }
          else
          {
            this.hasexams = false;

          }
          
        },
        error: (e) => console.error(e)
      });
  }

  settitle(title:any){

    this.currentexamtitle = title;

   this.getmyresults(this.currentUserdata._id);


  }
 
  searchExams(section:any): void {
 
 debugger
    this.examservice.findByStudentid(section)
      .subscribe({
        next: (data) => {
        
          this.exams = data.sort((one:any, two :any) => (one.date > two.date ? 1 : -1));
 
          console.log(this.exams);
          this.totalRecords=this.exams.length;
  
          if(this.totalRecords > 0){
            this.hasexams = true;

          }
          else
          {
            this.hasexams = false;

          }
          
        },
        error: (e) => console.error(e)
      });
  }

 
 
   onTableDataChange( event: any){
   
    this.page = event;
    this.searchExams(this.currentsection);
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.searchExams(this.currentsection);
  }
      
 
 
  reloadPage(): void {
    window.location.reload();
  }






}
