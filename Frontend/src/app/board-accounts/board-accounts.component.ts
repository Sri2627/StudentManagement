import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationService } from 'ngx-pagination';
 
import { Invoice } from '../models/accounts.model';
import { AccountService } from '../_services/account.service';
import { AuthService } from '../_services/auth.service';
import { StudentService } from '../_services/student.service';
import { TeacherService } from '../_services/teacher.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-board-accounts',
  templateUrl: './board-accounts.component.html',
  styleUrls: ['./board-accounts.component.css']
})
export class BoardAccountsComponent implements OnInit {


  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
 
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 10;
  tableSizes: any = [10, 15, 20, 50, 100];
  title = 'download';
  filename = 'report.xlsx';
  totalRecords: any;
  currentInvoice: Invoice = {
 
  };
  accounts?: Invoice[];
  invoice: Invoice = {
    
    name: '',
    studentid: '',
    standard: '',
    feeformat:'',
    lastdate: '',
    tutionfee: '',
    transportfee: '',
    termfee: '',
    total: '',
    ispaid: false,
 
  };
  submitted = false;
  studentData:any;
  sids:any;
  snames:any;
  mrecords:any;
  teacherData: any;
  schoolteachers!: number;
  schoolstudents: any;
  constructor(
    private studentservice: StudentService, 
    public router: Router, 
    private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder, 
    private authService:AuthService,  
    private teacherservice:TeacherService,  
    private studnetservice:StudentService,  
    
    private accountService:AccountService,
    public paginate: PaginationService,

  ) { }

  ngOnInit(): void {

    this.searchinvoices();
    this.retrieveTeachers();
    this.retrieveStudents();
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
  searchinvoices(): void {
  
 
 
    this.accountService.getAll()
      .subscribe({
        next: (data) => {
          this.accounts = data;
    
          this.totalRecords=this.accounts.length;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }







}
