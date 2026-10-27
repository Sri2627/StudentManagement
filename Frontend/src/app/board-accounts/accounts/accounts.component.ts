import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PaginationService } from 'ngx-pagination';
 
import { Invoice } from '../../models/accounts.model';
import { AccountService } from '../../_services/account.service';
import { AuthService } from '../../_services/auth.service';
import { StudentService } from '../../_services/student.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { forkJoin } from 'rxjs';


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


        
  sendinvoice(): void{
    this.studentservice.findBystandard(this.invoice.standard).subscribe({
      next: students => {
        if (students.length === 0) {
          this.errorMessage = "There are no students in this standard.";
          return;
        }

        const total = Number(this.invoice.tutionfee) +
          Number(this.invoice.transportfee) +
          Number(this.invoice.termfee);
        if (!Number.isFinite(total) || total <= 0) {
          this.errorMessage = "Enter a valid positive invoice total.";
          return;
        }

        const requests = students.map(student => this.accountService.create({
          name: student.fullname,
          studentid: student._id,
          admissionno: student.admissionno,
          standard: this.invoice.standard,
          feeformat: this.invoice.feeformat,
          lastdate: this.invoice.lastdate,
          tutionfee: this.invoice.tutionfee,
          transportfee: this.invoice.transportfee,
          termfee: this.invoice.termfee,
          total
        }));

        forkJoin(requests).subscribe({
          next: () => {
            this.submitted = true;
            this.searchinvoices();
          },
          error: error => {
            console.error("Invoice creation failed:", error);
            this.errorMessage = error.error?.message || "Unable to create invoices.";
          }
        });
      },
      error: error => {
        console.error("Student lookup failed:", error);
        this.errorMessage = error.error?.message || "Unable to retrieve students.";
      }
    });
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
