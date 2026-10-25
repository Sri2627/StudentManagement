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



@Component({
  selector: 'app-examresults',
  templateUrl: './examresults.component.html',
  styleUrls: ['./examresults.component.css']
})
export class ExamresultsComponent implements OnInit {
 
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
  currentsection: any;
  exams: any;
  customerid: any;
  students!: Students[];
  sids!: any;
  subject1: any;
  subject2: any;
  subject3: any;
  subject4: any;
  subject5: any;
  subject6: any;
  totalmarks: any;
  currentResult: any;
  ispassed: Boolean | undefined;
  isattended: Boolean | undefined;
  currentExam: any;
  currentResultdata: any;

  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private tutorialService: TutorialService, 
    private tokenStorage: TokenStorageService, 
    private resultservice: ResultsService,
    private examservice:ExamsService,
    private route: ActivatedRoute,
    public router: Router) { }
 
 
  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();


    this.eid = this.route.snapshot.params['id'];
   // this.getmydetails(this.currentUser.id);
    this.getmyresults();
  
  }
 

    getmydetails(id: string): void {
      
      this.studentservice.get(id)
        .subscribe({
          next: (data) => {
            this.currentUser = data;
            
            this.currentsection = this.currentUser.section;
            this.customerid = this.currentUser.id;
            //console.log(data);
            this.getmyresults();
        //this.searchExams( id ,this.currentsection)
          },
          error: (e) => console.error(e)
        });
    }
 
  
 

    
    
      getmyresults(){
        debugger
          this.resultservice.getAll()
          .subscribe({
          next: (data) => {
     
          this.currentResultdata = data.sort((one:any, two :any) => (Number(one.marksobtained) >= Number(two.marksobtained) ? -1 : 1));

          this.totalRecords = data.length;

          },
          error: (e) => console.error(e)
          });

      }


   

      setrank( ): void{
        debugger
        const examresult = this.currentexamresult;
        const length =  examresult.length;
       
        for(let j=0;j<length;j++){   
         
         
       
          if (j > 0 && examresult[j].marksobtained == examresult[j - 1].marksobtained) {
            this.rank = this.rank-1;
           }

          
           if (j > 0 && examresult[j].marksobtained << examresult[j - 1].marksobtained) {
            this.rank = this.rank+1;
           }

        
          const resultid  = examresult[j].id;
          const data = {
            rank : this.rank,
            totalattended: length,
          };
      
          this.resultservice.update(resultid, data)
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
          this.resultservice.delete(sid)
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
      this.getmyresults();
    }
    onTableSizeChange( event: any){
      this.tableSize= event.target.value;
      this.page = 1;
      this.getmyresults();
    }
   
    findsum(data:any[]){    
 
      this.pvalue=data;
      this.total = 0;
     // console.log(this.pvalue);  
      for(let j=0;j<data.length;j++){   
         this.total =  this.total+Number(this.pvalue[j].price);
         console.log(this.total)  
      }  
  }
  reloadPage(): void {
    window.location.reload();
  }

   

}