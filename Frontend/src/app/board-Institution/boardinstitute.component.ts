import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StudentService } from '../_services/student.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-boardinstitute',
  templateUrl: './boardinstitute.component.html',
  styleUrls: ['./boardinstitute.component.css']
})
export class BoardinstituteComponent implements OnInit {
  currentUser: any;
  currentuserid: any;
  code: any;
  studentData: any;
 

 
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
 
 
  
  
  constructor(private tokenStorage: TokenStorageService,
    private studnetservice : StudentService,
    private userService: UserService, 
 
    private authService: AuthService, 
   
    ) { }

  ngOnInit(): void {

     
    this.currentUser = this.tokenStorage.getUser();
    this.currentuserid  =this.currentUser.id;

    this.getmydetails(this.currentUser.id);

  }


    getmydetails(id: string): void {
 
    this.studnetservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          
          this.code = this.currentUser.code;
          this.retrieveStudents(this.code)

        },
        error: (e) => console.error(e)
      });
  }


  
  retrieveStudents(code :any){

    this.studnetservice.findBycode(code)
    .subscribe({
      next: (data) => {
         this.studentData = data;
         this.totalRecords=this.studentData.length;
  
      },
      error: (e) => console.error(e)
    });

  }
 
  
  onTableDataChange( event: any){
     
    this.page = event;
    this.retrieveStudents(this.code);
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.retrieveStudents(this.code);
  }



}
