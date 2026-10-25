import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../_services/student.service';
import { TresultService } from '../_services/tresult.service';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrls: ['./studentprofile.component.css']
})
export class StudentprofileComponent implements OnInit {
  id!:any;
  profileData!: any;
  currentexamresult!: any;
  constructor( private route: ActivatedRoute, 
    private tresultservice:TresultService,           
    private studentservice: StudentService ,  ) { }

  ngOnInit(): void {
 
    console.log(this.route.snapshot.params['id']);
    this.id = this.route.snapshot.params['id'];
    
    this.getstudent(this.id );
  
   }
 
   

    getstudent(id:any){

      this.studentservice.get(id)
      .subscribe({
        next: (data) => {
    
          this.profileData = data;
          this.retrivetotalReuslts(this.profileData.admissionno)
         
           
        },
        error: (e) => console.error(e)
      });

      

 
  }

  retrivetotalReuslts(number :any){
debugger
    this.tresultservice.getbystudentno(number)
    .subscribe({
      next: (data) => {
       this.currentexamresult= data;
      //  this.currentexamresult = data.sort((one:any, two :any) => (Number(one.rank) >= Number(two.rank) ? 1 : -1));
      //this.setrank(this.currentexamresult);
 

    
    
      },
      error: (e) => console.error(e)
    });
  }



  
}