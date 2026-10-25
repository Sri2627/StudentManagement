import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { FileUploadService } from '../_services/fileUploadService';
import { StudentService } from '../_services/student.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-studentregister',
  templateUrl: './studentregister.component.html',
  styleUrls: ['./studentregister.component.css']
})
export class StudentregisterComponent implements OnInit {

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  studentData: any;
  totalRecords: any;
  lastadmissionno!: number;
  
  selectedFiles?: FileList;
  currentFile: any;
  
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  resfilename: any;
  resfileurl!: any;
  resfilesize: any;
  resfiletype: any;
  currentUser: any;
  mysections: any;
  mysubjects:any
  newpassword!: any;
  form: any = {
    username: null,
    email: null,
    password:  this.newpassword,
    roles: ["user"],
    fullname: null,
    mobile: null,
    address:  null,
    standard:  null,
    class: null,
    photourl: this.resfileurl,
    section: "Admissions",
    profile: null,
  };
  currentid: any;

  constructor(private studentservice: StudentService, 
    private uploadService :FileUploadService,
    public router: Router, private tokenStorage: TokenStorageService,private formbuilder: FormBuilder, private authService:AuthService,  ) { }

  ngOnInit(): void {
    this.retrieveStudents();
  }
 

  onSubmit(): void {
                     const { username, email, password= this.newpassword, roles, fullname, mobile, address, standard, section, profile, photourl=this.resfileurl,admissionno = this.lastadmissionno } = this.form;
   
    this.authService.register(username, email, password, roles, fullname, mobile, address, standard, section, profile,photourl,admissionno).subscribe({
      next: data => {

        console.log(photourl);
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.studentData = data;
       
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  
  }

  retrieveStudents(): void {
    
    this.studentservice.getAll()
      .subscribe({
        next: (data) => {

          this.studentData = data;
          this.totalRecords=this.studentData.length;
          this.studentData = data.sort((one:any, two :any) => (one.admissionno > two.admissionno ? 1 : -1));
          
          this.lastadmissionno =  Number(this.studentData[this.totalRecords-1].admissionno);
          this.lastadmissionno = this.lastadmissionno+1;
         this.newpassword =  String(this.lastadmissionno);
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
  


  
  saveFile(filename: any): void {

    this.resfileurl = 'http://localhost:8090/files/'+filename;
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

              this.saveFile(this.resfilename);
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
