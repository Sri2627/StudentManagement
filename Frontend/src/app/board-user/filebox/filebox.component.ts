import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderPipe } from 'ngx-order-pipe';
import { PaginationService } from 'ngx-pagination';
import { Observable } from 'rxjs';
import { FILEBOX } from 'src/app/models/filebox.model';
import { AuthService } from 'src/app/_services/auth.service';
import { FileBoxService } from 'src/app/_services/filebox.service';
import { FileUploadService } from 'src/app/_services/fileUploadService';
import { StudentService } from 'src/app/_services/student.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/_services/user.service';
 


@Component({
  selector: 'app-filebox',
  templateUrl: './filebox.component.html',
  styleUrls: ['./filebox.component.css']
})
export class FileboxComponent implements OnInit {

 content?: string;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  totalRecords: any;
  currentUser: any;
  selectedFiles?: FileList;
  currentFile: any;
  fileData: any;
  progress = 0;
  message = '';
 
  fileInfos?: Observable<any>;
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 50;
  tableSizes: any = [10, 15, 20, 50, 100];
  currentfileid: any;


  resfilename: any;
  resfilesize: any;
  resfiletype: any;

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
  submitted = false;
  order: string = 'foldername';
 

  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private uploadService: FileUploadService,
    private fileboxService: FileBoxService,
    private tokenStorage: TokenStorageService, 
    public paginate: PaginationService,
    private orderPipe: OrderPipe,
    public router: Router) { }
 
 
  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();

    this.getmydetails(this.currentUser.id);

    this.fileInfos = this.uploadService.getFiles();
 
  }
 
selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  
    getmydetails(id: string): void {
      
      this.studentservice.get(id)
        .subscribe({
          next: (data) => {
            this.currentUser = data;
            console.log(data);

            this.getmyfiles(this.currentUser._id);

          },
          error: (e) => console.error(e)
        });
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

    this.fileboxService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });

      //this.reloadPage();
    
     
       // console.log(this.pvalue);  
     
  }
  

  
  createFolder(): void {
    const data = {
      
      foldername: this.file.foldername,
      name: this.file.foldername,
      userid: this.currentUser._id,
      parent_id: '',
      is_folder: true,
      
    };

    this.fileboxService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });

      this.reloadPage();
    
     
       // console.log(this.pvalue);  
     
  }



  newTutorial(): void {
    this.submitted = false;
    this.file = {
      name:'',
      size: '',
      userid: '',
      parent_id: '',
      fileurl: '',
      foldername: '',
      filetype: '',
      is_folder: false
    };
  }
  getstudent(id:any){
    console.log(id);
    this.fileboxService.get(id)
    .subscribe({
      next: (data) => {
  
        this.fileData = data;
        
        
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  
  
     }
  

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



  setfile(cid: string){

      this.currentfileid= cid; 

  }
  assignparent(pid: string){


    // alert(pid);
    // console.log( this.currentfileid);
    const data = {
           
      parent_id: pid,
   
      
    };
      if( pid==this.currentfileid){
        alert("you can not move this folder to same folder");

      }
      else{

        this.fileboxService.update(this.currentfileid, data)
        .subscribe({
          next: (res) => {
            console.log(res);
            alert("file succesfully moved");
          },
          error: (e) => console.error(e)
        });
      }





  }


  deletefile(sid : any){

    if(confirm("Are you sure to delete this file or folder")) {
      console.log("Implement delete functionality here");
    
      this.fileboxService.delete(sid)
      .subscribe({
        next: (res) => {
          console.log(res);
        
        },
        error: (e) => console.error(e)
      });
      alert(" File has been deleted");
     this.reloadPage();
    }

else {
  alert(" no");
 
}

  }


     
  reloadPage(): void {
    window.location.reload();
  }




  
}
