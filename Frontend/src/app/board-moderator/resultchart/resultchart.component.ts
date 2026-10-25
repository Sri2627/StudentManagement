import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { StudentService } from '../../_services/student.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { UserService } from '../../_services/user.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { Students } from '../../models/student.model';
import { map } from 'rxjs/operators';

import {NgxPaginationModule, PaginationService} from 'ngx-pagination'
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as XLSX  from 'xlsx';
import { TutorialService } from 'src/app/_services/tutorial.service';
 
import { ActivatedRoute } from '@angular/router';
import { ResultsService } from 'src/app/_services/results.service';
import { ExamsService } from 'src/app/_services/exams.service';
import { Observable } from 'rxjs';
import { FILEBOX } from 'src/app/models/filebox.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from 'src/app/_services/fileUploadService';
import { FileBoxService } from 'src/app/_services/filebox.service';
import { OrderPipe } from 'ngx-order-pipe';
import { TresultService } from 'src/app/_services/tresult.service';
import { Pipe, PipeTransform } from '@angular/core';
import { ExamtitlesService } from 'src/app/_services/examtitles.service';

@Component({
  selector: 'app-resultchart',
  templateUrl: './resultchart.component.html',
  styleUrls: ['./resultchart.component.css']
})


export class ResultchartComponent implements OnInit {
 
  currentUser: any;
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
  pvalue:any;
  total!: number;
  studentData!: any;
  section: any;
  
  tutorial: Tutorial = {
    title: '',
    description: '',
    studentid: '',
    
    customerid: '',
    published: false
  };
  submitted = false;
 
  mrecords!:any;

  eid :any;
  currentexamresult: any;
  currentexam:  any;
  examname: any;
  examsubject: any;
  gotresult!: boolean;
  rank = 1;

  examtitles: any;


  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private tresultservice: TresultService, 
    private tokenStorage: TokenStorageService, 
    private resultservice: ResultsService,
    private examservice:ExamsService,
    private totalservice :TresultService,
    private examsservice : ExamtitlesService,
    private route: ActivatedRoute,
    public router: Router) { }
 
 
  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();
    this.eid = this.route.snapshot.params['id'];
    this.getmydetails(this.currentUser.id);
   this.retriveReuslts();
    this.retrieveexams();
  }
 

  retrieveexams(): void {
    
    this.examsservice.getAll()
      .subscribe({
        next: (data) => {
          
          this.examtitles = data;
       
       
      
        },
        error: (e) => console.error(e)
      });
  }
 
    getmydetails(id: string): void {
      
      this.studentservice.get(id)
        .subscribe({
          next: (data) => {
            this.currentUser = data;
       
            //console.log(data);
        
          },
          error: (e) => console.error(e)
        });
    }

    searchtitleExams(title:any)
    {


    }

 
  
      retriveReuslts(){

        this.tresultservice.getAll()
        .subscribe({
          next: (data) => {
           this.currentexamresult= data;
            //this.currentexamresult = data.sort((one:any, two :any) => (Number(one.fullname) >= Number(two.fullname) ? -1 : 1));
          //this.setrank(this.currentexamresult);

            this.totalRecords=this.currentexamresult.length;
            console.log(this.currentexamresult);

            if(this.totalRecords > 0){
              this.gotresult = true;
              
            }
            else{
              this.gotresult = false;

            }
        
          },
          error: (e) => console.error(e)
        });
      }
  

      getbytitle(title:any){

        this.tresultservice.findByTitle(title)
        .subscribe({
          next: (data) => {
           //this.currentexamresult= data;
           this.currentexamresult = data.sort((one:any, two :any) => (Number(one.total) >= Number(two.total) ? -1 : 1));
            this.totalRecords=this.currentexamresult.length;
       
          },
          error: (e) => console.error(e)
        });
      }
  

      removeAll(){
        if(confirm("Are you sure to delete this exam")) {
     
          this.tresultservice.deleteAll( )
          .subscribe({
            next: (res) => {
              console.log(res);
              
            },
            error: (e) => console.error(e)
          });
          alert("all Deleted")
          this.reloadPage();
          
        }
    
            else {
              
              this.reloadPage();
            }
            
      }

      setrank( ): void{
 debugger
        const examresult = this.currentexamresult;
        const length =  examresult.length;
      
        for(let j=0;j<length;j++){   
         
        const length =  examresult.length;
        
       
          if (j > 0 && examresult[j].total == examresult[j - 1].total) {
            this.rank = this.rank-1;
           }

          
           if (j > 0 && examresult[j].total << examresult[j - 1].total) {
            this.rank = this.rank+1;
           }

        
          const resultid  = examresult[j].id;
          const data = {
            rank : this.rank,
            totalattended: length,
          };
      
          this.totalservice.update(resultid, data)
          .subscribe({
            next: (res) => {
              console.log(res);
             // alert("user data updated succesfully");
            },
            error: (e) => console.error(e)
          });
      
            this.reloadPage();
      
           }  
    
          // this.reloadPage();
        }
    

        deleterank( sid : any): void {
          this.totalservice.delete(sid)
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
      this.retriveReuslts();
    }
    onTableSizeChange( event: any){
      this.tableSize= event.target.value;
      this.page = 1;
      this.retriveReuslts();
    }
   
   
  reloadPage(): void {
    window.location.reload();
  }

   

}