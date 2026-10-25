import { ImplicitReceiver, ThisReceiver } from '@angular/compiler';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { Students } from '../models/student.model';
import { StudentService } from '../_services/student.service';
import { TokenStorageService } from '../_services/token-storage.service';
 
import {NgxPaginationModule, PaginationService} from 'ngx-pagination'
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as XLSX  from 'xlsx';
 import { OrderPipe } from 'ngx-order-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { SectionService } from '../_services/sections.service';
import { ContentService } from '../_services/content.service';
import { Observable } from 'rxjs';
import { FileUploadService } from '../_services/fileUploadService';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
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
  
  currentIndex = -1;
  lastadmissionno!: number;
  mysections: any;
  mysubjects: any;
 

  selectedFiles?: FileList;
  currentFile: any;
  
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  resfilename: any;
  resfileurl: any;
  resfilesize: any;
  resfiletype: any;
  currentUser: any;
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
    admissionno: '',
    subject: '',
    mysections: '',
    signature: '',
    code: '',
  };
  currentid: any;
  isedited!: boolean;

   
  constructor(private studentservice: StudentService, 
    
    private sectionservice :SectionService,
    private contentservice : ContentService,
    private uploadService : FileUploadService,
    public router: Router, private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder, private authService:AuthService,  public paginate: PaginationService) { }

  ngOnInit(): void {
    this.retrieveStudents();
    this.retrieveSections();
  }


  clickAddStudent(){
    this.stunderform.reset();
    this.showSave = true;
    this.showUpdate = false;
    this.modaltitle = "Add New Student";
  }

  onSubmit(): void {
                     const { username, email, password, roles, fullname, mobile, address, standard, section, profile, photourl=this.resfileurl,admissionno = this.lastadmissionno } = this.form;
   
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


  

  retrieveSections(): void {
    debugger
    this.sectionservice.getAll()
      .subscribe({
        next: (data) => {
          
          this.mysections = data;
 
        
       
      
        },
        error: (e) => console.error(e)
      });
  }
  retrieveStandard(): void {
    debugger
    this.contentservice.getAll()
      .subscribe({
        next: (data) => {
          
          this.mysubjects = data;
  
      
        },
        error: (e) => console.error(e)
      });
  }




  retrieveStudents(): void {
    
    this.studentservice.getAll()
      .subscribe({
        next: (data) => {

          this.studentData = data;
          this.totalRecords=this.studentData.length;
          this.students = data.sort((one:any, two :any) => (one.admissionno > two.admissionno ? 1 : -1));
         
          this.lastadmissionno =  Number(this.students[this.totalRecords-1].admissionno);
          this.lastadmissionno = this.lastadmissionno+1;
         
        },
        error: (e) => console.error(e)
      });
  }
 
       
 
  deletestudent( sid : any): void {

   
    
      this.studentservice.delete(sid)
        .subscribe({
          next: (res) => {
            console.log(res);
          
          },
          error: (e) => console.error(e)
        });
   
  
  
  }

 


  getmydetails(id: string): void {
 
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentdata = data;
          this.currentid  = this.currentdata._id;
          this.isedited = true;
        },
        error: (e) => console.error(e)
      });
  }


  updateStudent()
  {
   
    const data = {

      email: this.currentdata.email,
      fullname: this.currentdata.fullname,
      mobile: this.currentdata.mobile,
      address: this.currentdata.address,
      standard: this.currentdata.standard,
      section: this.currentdata.section,
      profile: this.currentdata.profile,
      photourl: this.resfileurl,
      
    }
 
    this.studentservice.update(this.currentid, data)
    .subscribe({
      next: (res) => {
        console.log(res);
        alert("user data updated succesfully");
      },
      error: (e) => console.error(e)
    });

      this.reloadPage();
 
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
      
 
  searchRole(): void {
   

    this.studentservice.findByrole(this.title)
      .subscribe({
        next: (data) => {
         
          this.students = data;
          console.log( );
         
        },
        error: (e) => console.error(e)
      });
  }
 
  reloadPage(): void {
    window.location.reload();
  }
  removeAllstudents():void{
    this.studentservice.deleteAll()
    .subscribe({
      next: (res) => {
        console.log(res);
        
      },
      error: (e) => console.error(e)
    });
  }
  

  promoteStudent(id : any){

    this.studentservice.get(id)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.currentStudent = res;
      },
      error: (e) => console.error(e)
    });

  }
 
 
  updatesection(id: string)
    {
    debugger
      const data = {
             
        section : this.currentStudent.section,
      
       
      
      }
   
      this.studentservice.update(id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert("user data updated succesfully");
        },
        error: (e) => console.error(e)
      });
  
        this.reloadPage();
     
  
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
              this.resfileurl = 'http://localhost:8090/files/'+this.resfilename,
               
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








}
