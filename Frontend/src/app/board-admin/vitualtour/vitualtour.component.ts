import { Component, OnInit } from '@angular/core';

import {
  AfterViewChecked,
  AfterViewInit,
 
  ElementRef,
  
  VERSION,
  ViewChild
} from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
 
import { Router } from '@angular/router';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
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
  selector: 'app-vitualtour',
  templateUrl: './vitualtour.component.html',
  styleUrls: ['./vitualtour.component.css']
})
export class VitualtourComponent implements OnInit {

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
  fileurl: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation?: number;
  translateH = 0;
  translateV = 0;
  scale = 1;
  aspectRatio = 4 / 6;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {
    translateUnit: 'px'
  };
  imageURL?: string;
  loading = false;
  allowMoveImage = false;
  fileid: any;


  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private uploadService: FileUploadService,
    private fileboxService: FileBoxService,
    private tokenStorage: TokenStorageService, 
    public paginate: PaginationService,
    private orderPipe: OrderPipe,
    public router: Router) { }
 
    name = 'Angular ' + VERSION.major;
     viewer!: any;

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
  updateFile(): void {
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

    this.fileboxService.update(this.fileid,data)
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

 
 imgChangeEvt: any = '';
 cropImgPreview: any = '';
 onFileChange(event: any): void {
     this.imgChangeEvt = event;
 }
 cropImg(e: ImageCroppedEvent) {
     this.cropImgPreview = e.base64;
 }
 imgLoad() {
     // display cropper tool
 }
 initCropper() {
     // init cropper
 }
 
 imgFailed() {
     // error msg
 }

 seturl(url :any, id: any)
 {

  this.fileurl  = url;
  this.fileid = id;
 

 }


 

 dataURItoBlob(dataURI :any){
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});

 }


 cropupdateimage (){
debugger
 
  this.currentFile = this.croppedImage;

  const blob = this.dataURItoBlob(this.croppedImage);

  const file = new File([blob], "fileName.png", {
    type: "image/png"
  });


 
  this.progress = 0;
  

    if (file) {
 
      
      this.uploadService.upload(file).subscribe({
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

            this.updateFile();
            alert('This file is cropped successfully.');
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
 

debugger

 
    

 }

 
     
  reloadPage(): void {
    window.location.reload();
  }

  fileChangeEvent(event: any): void {
    this.loading = true;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64	;
    console.log(event);
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
    this.loading = false;
  }

  loadImageFailed() {
    console.error('Load image failed');
  }

  rotateLeft() {
    this.loading = true;
    setTimeout(() => { // Use timeout because rotating image is a heavy operation and will block the ui thread
      this.canvasRotation--;
      this.flipAfterRotate();
    });
  }

  rotateRight() {
    this.loading = true;
    setTimeout(() => {
      this.canvasRotation++;
      this.flipAfterRotate();
    });
  }

  moveLeft() {
    this.transform = {
      ...this.transform,
      translateH: ++this.translateH
    };
  }

  moveRight() {
    this.transform = {
      ...this.transform,
      translateH: --this.translateH
    };
  }

  moveTop() {
    this.transform = {
      ...this.transform,
      translateV: ++this.translateV
    };
  }

  moveBottom() {
    this.transform = {
      ...this.transform,
      translateV: --this.translateV
    };
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
    this.translateH = 0;
    this.translateV = 0;
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {
      translateUnit: 'px'
    };
  }

  zoomOut() {
    this.scale -= .2;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .2;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  toggleAspectRatio() {
    this.aspectRatio = this.aspectRatio === 4 / 3 ? 4 /6 : 4 / 3;
  }



  
}
