import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PaginationService } from 'ngx-pagination';
 
import { AuthService } from 'src/app/_services/auth.service';
import { ExamsService } from 'src/app/_services/exams.service';
import { ResultsService } from 'src/app/_services/results.service';
 
import { TokenStorageService } from 'src/app/_services/token-storage.service';

import { ngxCsv } from 'ngx-csv/ngx-csv';
import { OrderPipe } from 'ngx-order-pipe';
import * as XLSX  from 'xlsx';
 
import { EXAMTITLE } from 'src/app/models/etitles.model';
import { SubjectService } from 'src/app/_services/subject.service';
import { SUBJECT } from 'src/app/models/subjects.model';
import { ExamtitlesService } from 'src/app/_services/examtitles.service';
 
@Component({
  selector: 'app-examtitles',
  templateUrl: './examtitles.component.html',
  styleUrls: ['./examtitles.component.css']
})
export class ExamtitlesComponent implements OnInit {
 

  
  currenttitle: EXAMTITLE = {
    
    
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
  sectionData!: EXAMTITLE[];


  constructor( private tokenStorage: TokenStorageService,
    private formbuilder: FormBuilder,
    private authService:AuthService, 
    private sbjservice: SubjectService,
    private examsservice :ExamtitlesService,
   
     public paginate: PaginationService) { }

  ngOnInit(): void {

    this.retrieveexams();
  }



  
  createsubject(): void {
     debugger
    const data = {
       title : this.currenttitle.title,
      description : this.currenttitle.description,
      section : this.currenttitle.section,


    };
    console.log(data);

    this.examsservice.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          alert(res.title);
          this.submitted = true;
        },
        error: (e) =>{

          console.error(e);

          alert(e.message);
        }
      });

  
       
     
  }


  deletestudent( sid : any): void {
    this.examsservice.delete(sid)
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
    this.retrieveexams();
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.retrieveexams();
  }
      
 

  retrieveexams(): void {
    
    this.examsservice.getAll()
      .subscribe({
        next: (data) => {
          
          this.sectionData = data;
          this.totalRecords=this.sectionData.length;
       
      
        },
        error: (e) => console.error(e)
      });
  }
 
  reloadPage(): void {
    window.location.reload();
  }




}
