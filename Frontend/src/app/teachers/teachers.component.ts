import { Component, OnInit } from '@angular/core';
import { ThisReceiver } from '@angular/compiler';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/shared/api.service';
 
 
//import { StudentModel } from '../student/student.model';
import { Students } from '../models/student.model';
import { RouterModule } from '@angular/router';
import { UserService } from '../_services/user.service';
import { StudentService } from '../_services/student.service';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

import {NgxPaginationModule, PaginationService} from 'ngx-pagination'
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { OrderPipe } from 'ngx-order-pipe';
import * as XLSX  from 'xlsx';
import { TeacherService } from '../_services/teacher.service';
import { SectionService } from '../_services/sections.service';
import { SECTION } from '../models/section.model';
import { ContentService } from '../_services/content.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileuploadComponent } from '../board-moderator/fileupload/fileupload.component';
import { FileUploadService } from '../_services/fileUploadService';



@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.\css']
})
export class TeachersComponent implements OnInit {
  public stunderform!: FormGroup;
  order: string = 'fullname';
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
    roles: ["moderator"]
 
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


  
  msection: SECTION = {
    section: '',
    standard: '',
    
    
  };
 
  mysections: any;
  mysubjects: any;
  checkedmysections: any;
  isMasterSel!: false;
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
    code:  '',
  };
  currentid:any;
  isedited!: boolean;
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
  

  constructor(private studentservice: StudentService, 
    private teacherservice: TeacherService,
    public router: Router, 
    private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder, 
    private uploadService: FileUploadService,
    private authService:AuthService, 
    private orderPipe: OrderPipe,
    private sectionservice: SectionService,
    private contentservice: ContentService,
    public paginate: PaginationService) { 


    }

  ngOnInit(): void {
     this.retrieveStudents();
    this.retrieveSections();
    this.retrieveSubjects();
    this.getCheckedItemList();

  }


  clickAddStudent(){
    this.stunderform.reset();
    this.showSave = true;
    this.showUpdate = false;
    this.modaltitle = "Add New Student";
  }

  onSubmit(): void {

  

    
                     const { username, email, password, roles, fullname, mobile, address,standard, subject, section,mysections = this.checkedmysections, profile, photourl=this.resfileurl,admissionno} = this.form;
   
    this.authService.tregister(username, email, password, roles, fullname, mobile, address,standard, subject, section,mysections, profile,photourl,admissionno).subscribe({
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
    
    this.teacherservice.getAll()
      .subscribe({
        next: (data) => {
          this.studentData = this.orderPipe.transform(data, 'username')
          this.studentData = data;
          this.totalRecords=this.studentData.length;
          this.students = this.orderPipe.transform(data, 'username')
          console.log(data);
      
        },
        error: (e) => console.error(e)
      });
  }
 
       
 
  deletestudent( sid : any): void {

   
    this.studentservice.delete(sid)
    .subscribe({
      next: (res) => {
        console.log(res);
        alert(" user has been deletedno");
      },
      error: (e) => console.error(e)
    });

    if(confirm("Are you sure to delete "+sid)) {
      console.log("Implement delete functionality here");
    
      this.studentservice.delete(sid)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert(" user has been deleted");
        },
        error: (e) => console.error(e)
      });
      this.reloadPage();
    }

else {
  alert(" no");
 
}

     
 
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
  



  checkUncheckAll() {

    for (var i = 0; i < this.mysections.length; i++) {

      this.mysections[i].isSelected = this.isMasterSel;

    }

    this.getCheckedItemList();

  }

   

  isAllSelected() {

    this.isMasterSel = this.mysections.every(function(item:any) {

        return item.isSelected == true;

      })

    this.getCheckedItemList();

  }


    getCheckedItemList(){

    this.checkedmysections = [];

    for (var i = 0; i < this.mysections.length; i++) {

      if(this.mysections[i].isSelected)

      this.checkedmysections.push(this.mysections[i].section);

    }

    //this.checkedmysections = JSON.stringify(this.checkedmysections);

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
