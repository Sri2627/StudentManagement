import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PaginationService } from 'ngx-pagination';
import { SECTION } from 'src/app/models/section.model';
import { AuthService } from 'src/app/_services/auth.service';
import { ExamsService } from 'src/app/_services/exams.service';
import { ResultsService } from 'src/app/_services/results.service';
import { SectionService } from 'src/app/_services/sections.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';



 
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { OrderPipe } from 'ngx-order-pipe';
import * as XLSX  from 'xlsx';
import { SYLLABUS } from 'src/app/models/syllabus.model';
import { SyllabusService } from 'src/app/_services/syllabus.service';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/_services/fileUploadService';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ContentService } from 'src/app/_services/content.service';

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.css']
})
export class SyllabusComponent implements OnInit {


  
  section: SYLLABUS = {
    section: '',
    standard: '',
    
    
  };
  submitted = false;
  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 10;
  tableSizes: any = [10, 15, 20, 50, 100];
  title = 'download';
  filename = 'report.xlsx';
  totalRecords: any;
  sectionData!: SYLLABUS[];
  syllbusdata!: SYLLABUS[];
  
  selectedFiles?: FileList;
  currentFile: any;
  
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  resfilename: any;
  resfilesize: any;
  resfiletype: any;
  currentUser: any;
  mysections: any;
  mysubjects:any
  currentchapter: any;

  

  constructor( private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder,
    private authService:AuthService, 
    private sectionservice: SectionService, 
    private syllabusservice : SyllabusService,
    private uploadService: FileUploadService,
    private resultsservice: ResultsService,
    private contentservice: ContentService,

     public paginate: PaginationService) { }

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.retrievesyllbus();
    this.retrieveSections();
    this.retrieveSubjects();
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




  
  createsection(): void {
debugger

const data = {
 
    subject: this.section.subject,
    description : this.section.description,
    standard : this.section.standard,
    section : this.section.section,
    chapterno : this.section.chapterno,
    chaptertitle : this.section.chaptertitle,
    videourl : 'http://localhost:8090/files/'+this.resfilename,
    filetype :this.resfiletype,
   
    };

    this.syllabusservice.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => {

          console.error(e);

          alert(e.message);
        }
      });

     this.reloadPage();
       
     
  }


  deletestudent( sid : any): void {
    this.syllabusservice.delete(sid)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert(res.message);
          this.reloadPage();
        },
        error: (e) =>{

          console.error(e);
          alert(e.message);
        }
         
      });
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
    this.retrievesyllbus();
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.retrievesyllbus();
  }
      
 

  retrievesyllbus(): void {
    
    this.syllabusservice.getAll()
      .subscribe({
        next: (data) => {

          this.syllbusdata = data;
          this.totalRecords=this.syllbusdata.length;
       
      
        },
        error: (e) => console.error(e)
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



  getmychapter(id: string): void {
      
    this.syllabusservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentchapter = data;
          
            
        },
        error: (e) => console.error(e)
      });
  }


  uploadattachment(id: string)
    {
    debugger
      const data = {
             
  
      attachmenturl : 'http://localhost:8090/files/'+this.resfilename,

       
      
      }
   
      this.syllabusservice.update(id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert("user data updated succesfully");
        },
        error: (e) => console.error(e)
      });
  
        this.reloadPage();
     
  
    }


 
  reloadPage(): void {
    window.location.reload();
  }




}
