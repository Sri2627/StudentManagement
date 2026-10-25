import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { FileUploadService } from '../_services/fileUploadService';
import { StudentService } from '../_services/student.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FILEBOX } from '../models/filebox.model';
import { FileBoxService } from '../_services/filebox.service';
import { OrderPipe } from 'ngx-order-pipe';
import{Students} from'../models/student.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-board-moderator',
  templateUrl: './board-moderator.component.html',
  styleUrls: ['./board-moderator.component.css']
})
export class BoardModeratorComponent implements OnInit {
  content?: string;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
 
  currentUser: any;
  totalRecords: any;
 
  selectedFiles?: FileList;
 
  fileData: any;

 
  currentFile?: File;
  progress = 0;
  message = '';
  eventfile:any;
  fileInfos?: Observable<any>;
 
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 50;
  tableSizes: any = [10, 15, 20, 50, 100];
  currentfileid: any;
  currentphotourl?: String;
  currentfile:any;
  submitted = false;
  resfilename: any;
  resfilesize: any;
  resfiletype: any;

  isSuccessful = false;
  isSignUpFailed = false;
 
  student ?: Students[];
  

  
  editForm: any = {
    fullname: null,
    mobile: null,
    email: null,
    address: null,
  };
  file: FILEBOX = {
   
    name: '',
    size: '',
    userid: '',
    parent_id: '',
    fileurl: '',
    foldername: '',
    filetype: '',
    is_folder: false


  };

  public stundentform!: FormGroup;
  studentModelObj: Students = new Students;
  studentData!: any;
 
  
  constructor(private userService: UserService, 
    private formbuilder: FormBuilder,
    private studentservice:StudentService, 
    private authService: AuthService, 
    private uploadService: FileUploadService,
    private tokenStorage: TokenStorageService, 
    private fileboxService: FileBoxService,
    private orderPipe: OrderPipe,
    public router: Router) { }
 
 
  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();

    this.getmydetails(this.currentUser.id);

    this.stundentform = this.formbuilder.group({
      fullname:[''],
      email:[''],
      mobile:[''],
      address:[''],
      password:[''],
    })
    this.getmydetails(this.currentUser.id)


  }
 
selectFile(event: any): void {
  this.selectedFiles = event.target.files;
}


  getmydetails(id: string): void {
 
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          
          this.getmyfiles(this.currentUser._id);
 
          console.log(this.currentUser.admissionno, this.currentUser.email,this.currentUser.mobile,this.currentUser.address);

          this.stundentform.controls['fullname'].setValue(this.currentUser.fullname);
          this.stundentform.controls['email'].setValue(this.currentUser.email);
          this.stundentform.controls['mobile'].setValue(this.currentUser.mobile);
          this.stundentform.controls['address'].setValue(this.currentUser.address);
          this.stundentform.controls['password'].setValue(this.currentUser.password);

        },
        error: (e) => console.error(e)
      });
  }

  updateStudentDetails()
  {
    this.currentfileid= this.currentUser._id; 
    const data = {
           
      fullname : this.stundentform.value.fullname,
      email: this.stundentform.value.email,
      mobile: this.stundentform.value.mobile,
      address: this.stundentform.value.address,
  
   
      
    }
 
    this.studentservice.update(this.currentfileid, data)
    .subscribe({
      next: (res) => {
        console.log(res);
        alert("user data updated succesfully");
      },
      error: (e) => console.error(e)
    });


     // this.reloadPage();

  }

 
   // Getter to access form control
   get myForm() {
    return this.editForm.controls;
  }
  onSubmit() {}


    getmyfiles(userid: string): void {
      
      this.fileboxService.findByStudentid(userid)
        .subscribe({
          next: (data) => {
         
            this.fileData = data;
           this.totalRecords=this.fileData.length;
          // this.students = data;
          //  this.sids = data.map( (item) => item._id);
            console.log(data);
          },
          error: (e) => console.error(e)
        });
    }
    onTableDataChange( event: any){
     
      this.page = event;
      this.getmyfiles(this.currentUser._id);
    }
    onTableSizeChange( event: any){
      this.tableSize= event.target.value;
      this.page = 1;
      this.getmyfiles(this.currentUser._id);
    }
         
    getmychildren(pid: string ){
  
      let cuserid = this.currentUser._id;
  
      this.fileboxService.findBypatentid(cuserid,pid)
      .subscribe({
        next: (data) => {
       
          this.fileData = data;
         this.totalRecords=this.fileData.length;
        // this.students = data;
        //  this.sids = data.map( (item) => item._id);
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  
    }
  
    getdetails(cfilename: string){
  
      this.uploadService.getFile(cfilename)
      .subscribe({
        next: (res) => {
          console.log(res);

          
        },
        error: (e) => console.error(e)
      });
  
    }
  

    getmyfiledetails(Fid: string){
 
      this.fileboxService.get(Fid)
      .subscribe({
        next: (data) => {
          this.currentphotourl = data.fileurl;
     
         console.log( this.currentphotourl);

         this.setprofileimage(Fid)
        
        },
        error: (e) => console.error(e)
      });
    }
 

 
    setprofileimage(cid: string){
  

      this.currentfileid= this.currentUser._id; 
     
      console.log( this.currentphotourl);
      const data = {
           
        photourl : this.currentphotourl
     
        
      };

      this.studentservice.update(this.currentfileid, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert("Profile Photo succesfully changed");
        },
        error: (e) => console.error(e)
      });


        this.reloadPage();
  }


     
    
    reloadPage(): void {
      window.location.reload();
    }
  
  

  
}
