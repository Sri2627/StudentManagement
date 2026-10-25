import { NgAnalyzeModulesHost, ThisReceiver } from '@angular/compiler';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { Students } from '../../models/student.model';
import { StudentService } from '../../_services/student.service';
import { TokenStorageService } from '../../_services/token-storage.service';
 
import {NgxPaginationModule, PaginationService} from 'ngx-pagination'
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as XLSX  from 'xlsx';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { OrderPipe } from 'ngx-order-pipe';
import { OrderModule } from 'ngx-order-pipe';


@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css']
})
export class ClassroomComponent implements OnInit {
  public stunderform!: FormGroup;
  
  studentData!: any;
  isLoggedIn = false;
  showSave!: boolean;
  showUpdate!:boolean;
  modaltitle!: string;
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 50;
  tableSizes: any = [10, 15, 20, 50, 100];
  title = 'download';
  filename = 'report.xlsx';
  totalRecords: any;

  form: any = {
    _id : null,
    username: null,
    email: null,
    password: null,
    roles: ["user"],
  
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';


  students?: Students[];
  currentStudent: Students = {
    username: '',
    email: '',
    password: '',

    roles: undefined,
    _id: '',
    fullname: '',
    mobile: '',
    address: '',
    standard: '',
    photourl: '',
    section: '',
    profile: '',
    admissionno: '',
    subject: '',
    mysections: '',
    signature: '',
    code:  '',
  };
  tutorial: Tutorial = {
    title: '',
    description: '',
    studentid: '',
    customerid: '',
    published: false
  };
  submitted = false;
  currentIndex = -1;
 
  currentUserid: any;
  currentUser: any;
  mobile: any;
  section: any;
  customerid: any;
  sids?: any;
  currentsection: any;
  mysections: any;
  constructor(private studentservice: StudentService, 
    public router: Router, 
    private tutorialService: TutorialService, 
    private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder, 
    private authService:AuthService,  
    public paginate: PaginationService) { }

  ngOnInit(): void {
    
    this.currentUser = this.tokenStorage.getUser();
    this.customerid = this.currentUser.id;

    console.log(this.customerid);
    this.getmydetails(this.customerid);
 

  }

  getmydetails(id: string): void {
      
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          this.customerid = this.currentUser._id;
          this.mysections = this.currentUser.mysections;
          this.currentsection = this.currentUser.section;
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
}


  
updateSection (sec :string){
    debugger
  const data = {  
    section: sec 
 }
  const eid = this.customerid;
  console.log(eid);

  this.studentservice.update(eid, data)
  .subscribe({
    next: (res) => {
      console.log(res);
      
      alert("Your Section Updated");
    },
    error: (e) => console.error(e)
  });

}



  clickAddStudent(){
    this.stunderform.reset();
    this.showSave = true;
    this.showUpdate = false;
    this.modaltitle = "Add New Student";
  }

  onSubmit(): void {
                     const { username, email, password, roles, fullname, mobile, address, standard, section, profile, photourl,admissionno} = this.form;
   
    this.authService.register(username, email, password, roles, fullname, mobile, address, standard, section, profile,photourl,admissionno).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  
  }

  retrieveStudents(): void {
    
    this.studentservice.getAll( )
      .subscribe({
        next: (data) => {

          this.studentData = data;
          this.totalRecords=this.studentData.length;
          this.students = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
 
       
  getmystudents(section: string): void {
      
    this.studentservice.findByCustmerid(section)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          this.studentData = data.sort((one:any, two :any) => (one.admissionno > two.admissionno ? 1 : -1));
        this.studentData = data;
          this.totalRecords=this.studentData.length;
          this.students = data;
          this.sids = data.map( (item) => item._id);
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }



  setActiveStudents(students: Students, index: number): void {
    this.currentStudent = students;
    this.currentIndex = index;
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
    this.retrieveStudents();
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.retrieveStudents();
  }
      
  
getstudent(id:any){

  this.studentservice.get(id)
  .subscribe({
    next: (data) => {

      this.studentData = data;
      
      
      console.log(data);
    },
    error: (e) => console.error(e)
  });


   }

 

   sendmessage(): void{
    debugger
    this.section = this.currentsection;

    console.log( this.section);
    this.getmystudents(this.section);
    const length = this.totalRecords;
   
    for(let j=0;j<length;j++){   
    

      const data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
        customerid: this.customerid,
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

   
    reloadPage(): void {
      window.location.reload();
    }


}

 