import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationService } from 'ngx-pagination';
 
import { Invoice } from '../../models/accounts.model';
import { AccountService } from '../../_services/account.service';
import { AuthService } from '../../_services/auth.service';
import { StudentService } from '../../_services/student.service';
import { TokenStorageService } from '../../_services/token-storage.service';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

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
    admissionno: '',
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
  admisssionid: any;
  constructor(
    private studentservice: StudentService, 
    public router: Router, 
    private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder, 
    private authService:AuthService,  
    private accountService:AccountService,
    public paginate: PaginationService,

  ) { }

  ngOnInit(): void {

    this.searchinvoices();

  }


        
  getmystudents(standard: any): void {
     this.studentservice.findBystandard(standard)
      .subscribe({
        next: (data) => {
       
          //this.studentData = data.sort((one:any, two :any) => (one.admissionno > two.admissionno ? 1 : -1));
        this.studentData = data;
        this.mrecords = this.studentData.length;
      
        const student = this.mrecords;
        if(this.mrecords == 0){
          alert("this class does not have any students");
        }

          this.sids = data.map( (item) => item._id);
          this.admisssionid = data.map( (item) => item.admissionno);
          this.snames = data.map( (item) => item.fullname);
        },
        error: (e) => console.error(e)
      });
  }

  sendinvoice(): void{
 

    this.getmystudents( this.invoice.standard);
    const length = this.mrecords;
   
    for(let j=0;j<length;j++){   
    

      const data = {
       
    name:this.snames[j],
    studentid: this.sids[j],
    admissionno: this.admisssionid[j],
    standard:this.invoice.standard,
    feeformat:this.invoice.feeformat,
    lastdate: this.invoice.lastdate,
    tutionfee: this.invoice.tutionfee,
    transportfee: this.invoice.transportfee,
    termfee:this.invoice.termfee,
    total: Number(this.invoice.tutionfee)+ Number(this.invoice.transportfee)+ Number(this.invoice.termfee),
       
      };
  
      this.accountService.create(data)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.submitted = true;

        
          },
          error: (e) => {
            console.error(e);
            console.log(e.message);
            alert(e.message);
          }
          
        });
  
       }  
       
        
      // this.reloadPage();
    }

    removeAll(): void {
      this.accountService.deleteAll()
        .subscribe({
          next: (res) => {
            console.log(res);
            this.reloadPage();
          },
          error: (e) => console.error(e)
        });
    }
  
     
  reloadPage(): void {
    window.location.reload();
  }


  onTableDataChange( event: any){
     
    this.page = event;
    this.searchinvoices();
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.searchinvoices();
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
