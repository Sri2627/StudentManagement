import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationService } from 'ngx-pagination';
import { CONTENT } from 'src/app/models/content.model';
import { EXAMS } from 'src/app/models/exams.model';
import { RESULTS } from 'src/app/models/results.model';
import { SYLLABUS } from 'src/app/models/syllabus.model';
import { AuthService } from 'src/app/_services/auth.service';
import { ContentService } from 'src/app/_services/content.service';
import { ExamsService } from 'src/app/_services/exams.service';
import { ResultsService } from 'src/app/_services/results.service';
import { StudentService } from 'src/app/_services/student.service';
import { SyllabusService } from 'src/app/_services/syllabus.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-tsyllabus',
  templateUrl: './tsyllabus.component.html',
  styleUrls: ['./tsyllabus.component.css']
})
export class TsyllabusComponent implements OnInit {
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

  exams?: SYLLABUS[];
  currentExam: SYLLABUS = {
 
  };
  
  exam: SYLLABUS = {
    
 
  };
  submitted = false;
  currentResult : SYLLABUS= {}
 
  currentIndex = -1;
  currentUser!:any;
  currentUserdata!:any;
  subjects?: CONTENT[];
  mysyllabus :any;
  hasresult!:boolean;

   
  constructor(private studentservice: StudentService, 
    public router: Router, 
    private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder,
    private resultservice: ResultsService,
    private authService:AuthService, 
    private contentservice : ContentService,
    private syllabuservice : SyllabusService,
    
     public paginate: PaginationService) { }

  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();

    this.getmydetails(this.currentUser.id);


    this.retrivesubjects();
  }

  getmydetails(id: string): void {
      
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUserdata = data;
     
          console.log(  this.currentUserdata._id);
          console.log(  this.currentUserdata.section);
        },
        error: (e) => console.error(e)
      });
  }
  
 
   

    
 
  searchExams(): void {
 
 
    this.syllabuservice.getAll( )
      .subscribe({
        next: (data) => {
        
          this.exams = data.sort((one:any, two :any) => (one.date > two.date ? 1 : -1));
 
       
          this.totalRecords=this.exams.length;

          
        },
        error: (e) => console.error(e)
      });
  }


   
  retrivesubjects(): void {
 
 
    this.contentservice.getAll( )
      .subscribe({
        next: (data) => {
        
          this.subjects = data.sort((one:any, two :any) => (one.subject > two.subject ? 1 : -1));
 
          console.log(this.exams);
          this.totalRecords=this.subjects.length;

          
        },
        error: (e) => console.error(e)
      });
  }


  retrivesyllabus(subject :any): void {
    debugger
    const  standard =  this.currentUserdata.standard;
 
    this.syllabuservice.findBySubject( subject, standard)
      .subscribe({
        next: (data) => {
        
          this.mysyllabus = data;
          const records = this.mysyllabus.length;

        if(records > 0){

          this.hasresult= true;
        }
        else{
          this.hasresult= false;
        }

          
        },
        error: (e) => console.error(e)
      });
  }

 
   onTableDataChange( event: any){
   
    this.page = event;
    this.searchExams();
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.searchExams();
  }
      
 
 
  reloadPage(): void {
    window.location.reload();
  }

}
