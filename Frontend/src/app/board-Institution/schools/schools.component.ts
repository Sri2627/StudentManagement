import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Students } from 'src/app/models/student.model';
import { AdminService } from 'src/app/_services/admin.service';
import { AuthService } from 'src/app/_services/auth.service';
import { StudentService } from 'src/app/_services/student.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit {
  currentUser: any;
  currentuserid: any;
  code!: "admin";
  studentData: any;
  public adminform!: FormGroup;

 
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
  lastadmissionno!: number;
  
  isSuccessful!:boolean;
  currentdata: Students = {
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
    code: '',
    subject: '',
    mysections: '',
    signature: '',
    admissionno: ''
  };
  form: any = {
    _id : null,
    username: null,
    email: null,
    password: null,
    roles: ["admin"],
  
  };
  showSave!: boolean;
   
  showUpdate!: boolean;
  isSignUpFailed!: boolean;
  errorMessage: any;
   
  constructor(private tokenStorage: TokenStorageService,
    private studnetservice : StudentService,
    private adminService: AdminService, 
 
    private authService: AuthService, 
   
    ) { }

  ngOnInit(): void {

     
    this.currentUser = this.tokenStorage.getUser();
    this.currentuserid  =this.currentUser.id;

    this.getmydetails(this.currentUser.id);

  }


    getmydetails(id: string): void {
 
    this.studnetservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          
          this.code = this.currentUser.code;
          this.retrieveStudents();

        },
        error: (e) => console.error(e)
      });
  }


  clickAddStudent(){
    this.adminform.reset();
    this.showSave = true;
    this.showUpdate = false;
    this.modaltitle = "Add New Student";
  }

  onSubmit(): void {
    debugger
                     const { username, email, password, roles, fullname, mobile, address, standard, section, profile,code = this.lastadmissionno } = this.form;
   
    this.authService.aregister(username, email, password, roles, fullname, mobile, address, standard, section, profile,code).subscribe({
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



  
  retrieveStudents( ){
  debugger
    this.adminService.getAll()
    .subscribe({
      next: (data) => {
         this.studentData = data;
         this.totalRecords=this.studentData.length;
         this.studentData = data.sort((one:any, two :any) => (one.code > two.code ? 1 : -1));
         
          this.lastadmissionno =  Number(this.studentData[this.totalRecords-1].code);
          this.lastadmissionno = this.lastadmissionno+1;
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
    this.retrieveStudents( );
  }




}
