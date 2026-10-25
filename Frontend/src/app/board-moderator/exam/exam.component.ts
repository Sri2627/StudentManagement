import { Component, OnInit } from '@angular/core';
import { IfStmt, ImplicitReceiver, ThisReceiver } from '@angular/compiler';
 
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { StudentService } from '../../_services/student.service';
import { TokenStorageService } from '../../_services/token-storage.service';
 
import {NgxPaginationModule, PaginationService} from 'ngx-pagination'
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as XLSX  from 'xlsx';
 
import { ExamsService } from 'src/app/_services/exams.service';
import { EXAMS } from 'src/app/models/exams.model';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { OrderPipe } from 'ngx-order-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { TeacherService } from 'src/app/_services/teacher.service';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { ResultsService } from 'src/app/_services/results.service';
import { RESULTS } from 'src/app/models/results.model';
import { Students } from 'src/app/models/student.model';
import { ContentService } from 'src/app/_services/content.service';
import { TRESULTS } from 'src/app/models/totalresult.model';
import { TresultService } from 'src/app/_services/tresult.service';
import { ExamtitlesService } from 'src/app/_services/examtitles.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  public stunderform!: FormGroup;
  
  studentData!: any;
  isLoggedIn = false;
  showSave!: boolean;
  showUpdate!:boolean;
  modaltitle!: string;
  searchterm = "";
  searchtermstudents = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 10;
  tableSizes: any = [10, 15, 20, 50, 100];
  title = 'download';
  filename = 'report.xlsx';
  totalRecords: any;

  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isresultset!: any;


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
    published: false,
    resultset: false
  };
  gresult :any;
  

  currentResult : RESULTS= {}
 
  result: RESULTS = {
    examid: '',
    studentid: '',
    studentname: '',
    totalmarks: '100',
    marksobtained: '',
    attachmenturl: '',
    is_attended: false,
    ispassed: false,
 
  };

 examtitles: any;
  
  students?: Students[];
  currentStudent: Students = {
    _id: '',
    username: '',
    email: '',
    password: '',
    admissionno: '',
    roles: '',
    fullname: '',
    mobile: '',
    address: '',
    standard: '',
    section: '',
    profile: '',
    photourl: '',
    subject: '',
    mysections: '',
    signature: '',
    code:  '',
  };


  submitted = false;
  currentsection: any;
  mysections: any;

  currentIndex = -1;
  currentUser!:any;
  currentUserdata!:any;
  mlength!:any;
  sids:any;
  section :any;
  tutorial: Tutorial = {
    title: '',
    description: '',
    studentid: '',
    customerid: '',
    published: false
  };
  mysubjects: any;
  customerid: any;
  tresult: any;
  length!: number;
  marks: any;
  marksobtained: any;
  currentexamtitle: any;
  currentResultdata!: RESULTS[];
  hasexams!: boolean;
 
   
  constructor(private studentservice: StudentService, 
    public router: Router, 
    private tutorialservice: TutorialService,
    private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder,
    private authService:AuthService, 
    private resultservice: ResultsService,
    private examservice: ExamsService, 
    private examtitleservice: ExamtitlesService,
    private contentservice: ContentService,
    private resultsservice: ResultsService,
    private totalservice :TresultService,
     public paginate: PaginationService) { }

  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();
    this.customerid =   this.currentUser.id;
 
    this.getmydetails(this.currentUser.id);
 
    this.retrieveSubjects();
    this.retrieveexamstitles();
  

    this.getstudents(this.currentUserdata.section);
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


  getmydetails(id: string): void {
      
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUserdata = data;
           
          this.currentsection = this.currentUserdata.section;
          this.mysections = this.currentUserdata.mysections;
          console.log(  this.currentUserdata._id);
          console.log(  this.currentUserdata.section);

          this.searchExams(this.currentsection,this.currentUserdata._id)

          this.getmystudents(this.currentsection);

        },
        error: (e) => console.error(e)
      });
  }
 
  setmysection( section : string)
  {
    alert(" Your Section Changed to " + section);
    console.log(section);
     this.currentsection = section;
   
    this.getmystudents(this.currentsection);
    this.updateSection(this.currentsection);
    this.reloadPage();
  }
  
   
updateSection (sec :string){
 
const data = {  
  section: sec 
}
const eid = this.customerid;
 

this.studentservice.update(eid, data)
.subscribe({
  next: (res) => {
    console.log(res);
    
    alert("Your Section Updated");
  },
  error: (e) => console.error(e)
});

}


  
  createexam(): void {
     
    const data = {
      title: this.exam.title,
      date: this.exam.date,
      subject: this.exam.subject,
      syllabus: this.exam.syllabus,
      customerid: this.currentUserdata._id,
      section: this.currentsection,
    };

    this.examservice.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          
        },
        error: (e) => console.error(e)
      });

    
     this.reloadPage();
       
     
  }


  setstudentsresults(){
 
    
    this.getstudents(this.currentUserdata.section);
    

    const length = this.totalRecords;
    
    for(let j=0;j<length;j++){   
    

      const Rdata = {
        examid:  this.currentExam.id,
        studentid: this.studentData[j]._id,
        studentname: this.studentData[j].fullname,
        totalmarks: 100,
        marksobtained: "",
        attachmenturl: "",
        is_attended: true,
        ispassed: true,
      };
   
      this.resultsservice.create(Rdata)
        .subscribe({
          next: (res) => {
            console.log(res);
          
          },
          error: (e) => console.error(e)
        });
  
   }  


  }
  
  getresult(eid : string, sid:string){
 

    this.resultsservice.findByStudentid(eid,sid)
    .subscribe({
      next: (data) => {
        this.currentResult = data;
      
      
        if(!data)
        {
          this.isresultset = false;
          console.log( this.isresultset);
        }
        else{
          this.isresultset = true;
          console.log( this.isresultset);
        }

      },
      error: (e) => console.error(e)
    });
  }

  newresult(){

    this.submitted = false;
    this.result = {
      
    };

    this.currentResult = {
      
    };
  }


  setresult(): void {

       const data = {

      examid:  this.currentExam.id,
      examtitle:  this.currentExam.title,
      subject:  this.currentExam.subject,
      section:  this.currentsection,
      studentid: this.currentStudent._id,
      studentname: this.currentStudent.fullname,
      totalmarks: this.result.totalmarks,
      marksobtained: this.result.marksobtained,
      attachmenturl: this.currentStudent.photourl,
      is_attended: this.result.is_attended,
      ispassed: this.result.ispassed,
    };

    this.resultsservice.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });

     
     
     
  }


 
  retrieveStudents(): void {
    
    this.studentservice.getAll()
      .subscribe({
        next: (data) => {

          this.studentData = data;
        
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  retrieveSubjects(): void {
    debugger
    this.contentservice.getAll()
      .subscribe({
        next: (data) => {
          
          this.mysubjects = data;
  
      
        },
        error: (e) => console.error(e)
      });
  }


 

 
  getexam( sid : any): void {

    this.examservice.get(sid)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentExam = res;
        },
        error: (e) => console.error(e)
      });
      
     
  
  }
  getstudent( sid : any): void {

    this.studentservice.get(sid)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentStudent = res;
          this.newresult();
          this.getresult(this.currentExam.id,sid);
        },
        error: (e) => console.error(e)
      });
      
     
  
  }
 
 
  Deleteexam( sid : any): void {

   
    if(confirm("Are you sure to delete this exam")) {
     
      this.examservice.delete(sid)
      .subscribe({
        next: (res) => {
          console.log(res);
          
        },
        error: (e) => console.error(e)
      });
      alert("Exam Deleted")
      this.reloadPage();
      
    }

        else {
          
          this.reloadPage();
        }
        
  
  }

 
 
  searchExams(section:  any, customerid: any): void {
     this.examservice.findBysection(section,customerid)
      .subscribe({
        next: (data) => {
       
          this.exams = data;
          this.totalRecords=this.exams.length;
          // this.str =   this.exams[0].date;

          // const [year, month, day] = this.str.split('-');

          // console.log(month); // 👉️ "07"
          // console.log(day); // 👉️ "21"
          // console.log(year); // 👉️ "2024"

          this.exams = data.sort((one:any, two :any) => (one.date > two.date ? 1 : -1));
          
          // 👇️ {id: 3, date: Thu Apr 21 2022,
          //     id: 2, date: Sat Jan 21 2023
          //     id: 5, date: Wed Apr 21 2027}
          console.log(this.exams);


          
        },
        error: (e) => console.error(e)
      });
  }

 
 

   onTableDataChange( event: any){
   
    this.page = event;
    this.retrieveStudents();
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.retrieveStudents();
  }
      
 
 
  reloadPage(): void {
    window.location.reload();
  }

  getmystudents(section: string): void {
    console.log(section);

    
    this.studentservice.findByCustmerid(section)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
       
        this.mlength = data.length;
        console.log( this.mlength);
          this.sids = data.map( (item) => item._id);
          //this.sendmessage(this.mlength);
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }


  getstudents(section: string): void {
    console.log(section);

    
    this.studentservice.findByCustmerid(section)
      .subscribe({
        next: (data) => {
        this.studentData = data;
        this.students = data;
        this.studentData = data.sort((one:any, two :any) => (one.admissionno > two.admissionno ? 1 : -1));
        this.totalRecords=this.students.length;
        this.currentStudent =this.studentData[0];
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  Updateexam (id :any){
    
    const data = {
        
      published: true
      
    }
    const eid = id;

    this.examservice.get(eid)
    .subscribe({
      next: (res) => {
       
        if(res.resultset == false || !res.resultset){
          alert("Please set the result first");
        }
        else{

          this.examservice.update(eid, data)
          .subscribe({
            next: (res) => {
              console.log(res);
              alert("exam status updated, exam result will be seen by students");
            },
            error: (e) => console.error(e)
          });
        }

    
      },
      error: (e) => console.error(e)
    });
     
     

 


  }

  
  updateResult (id :any){
    
    const data = {  
      resultset: true
   }
    const eid = id;
    this.examservice.update(eid, data)
    .subscribe({
      next: (res) => {
        console.log(res);
        
        alert("Result Updated");
      },
      error: (e) => console.error(e)
    });

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

  generatemarklist(title:any): void{
  debugger
 
  this.getmystudents(this.currentsection);
  const noofstudents = this.currentUser.length;
  
  for(let j=0;j<noofstudents;j++){  
         
    const sid = this.sids[j];
          
    console.log(sid);

         
      this.resultservice.findBystudentresult(sid,title)
      .subscribe({
        next: (data) => {
          this.currentResultdata = data;
          console.log( this.currentResultdata);
          this.examtitles;
          const titles = this.currentResultdata.length;


         
              
              const rdata = {

            
                studentid:this.currentUser[j].admissionno,
                photourl : this.currentUser[j].photourl,
                studentname:this.currentUser[j].fullname,
                exam :title,
                 s1 : Number(this.currentResultdata[0].marksobtained),
                 s2 : Number(this.currentResultdata[1].marksobtained),
                 s3 : Number(this.currentResultdata[2].marksobtained),
                 s4 : Number(this.currentResultdata[3].marksobtained),
                 s5 : Number(this.currentResultdata[4].marksobtained),
                 s6 : Number(this.currentResultdata[5].marksobtained),
                section:this.currentsection,
                totalmarks :this.currentResultdata[0].totalmarks,
                total: Number(this.currentResultdata[0].marksobtained)+
                            Number(this.currentResultdata[1].marksobtained)+
                            Number(this.currentResultdata[2].marksobtained)+
                            Number(this.currentResultdata[3].marksobtained)+
                            Number(this.currentResultdata[4].marksobtained)+
                            Number(this.currentResultdata[5].marksobtained)

                        
              };
          
              this.totalservice.create(rdata)
                .subscribe({
                  next: (res) => {
                    console.log(res);
                  
                  },
                  error: (e) => {
                    console.error(e);
                  
                  }
                });
          
        },
        error: (e) => console.error(e)
      });
         
 
        
      

     
        
     
        
      }
    }
    

}
