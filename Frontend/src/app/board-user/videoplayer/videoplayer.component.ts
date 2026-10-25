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
import { SyllabusService } from 'src/app/_services/syllabus.service';
import { SYLLABUS } from 'src/app/models/syllabus.model';


@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.css']
})
export class VideoplayerComponent implements OnInit {
  currentUser: any;
  currentsubject: any;
  currentUserdata: any;
  currentsection: any;
 

  mysyllabus: any;
  eid: any;
  currentchapter:any;
  chaptervidoeurl!: string;
  chaptertitle: any;
  hasresult!: boolean;
  chapterattachment: any;


  constructor(private userService: UserService, 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private tutorialService: TutorialService, 
    private tokenStorage: TokenStorageService, 
    private resultservice: ResultsService,
    private examservice:ExamsService,
    private syllabuservice: SyllabusService,
    private route: ActivatedRoute,
    public router: Router) { }

  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();
    this.eid = this.route.snapshot.params['id'];
    
    this.currentsubject = this.route.snapshot.params['subject'];
    this.getmydetails(this.currentUser.id);



    


  }
  getmydetails(id: string): void {
      
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUserdata = data;
          this.currentsection = this.currentUserdata.standard;
         
          this.retrivesyllabus(this.currentsection);

        },
        error: (e) => console.error(e)
      });
  }
  
 
  retrivesyllabus( statndard:any): void {
    debugger
   
    console.log( this.eid);
  


    this.syllabuservice.findBySubject( this.eid, statndard )
      .subscribe({
        next: (data) => {
        
          this.mysyllabus = data;
          const records = this.mysyllabus.length;
          this.currentchapter =this.mysyllabus[0];
          this.chaptervidoeurl=   this.currentchapter.videourl;
          this.chaptertitle = this.currentchapter.chaptertitle;
          this.chapterattachment = this.currentchapter.attachmenturl;
          if(records > 0){

            this.hasresult= true;
          }
          else{
            this.hasresult= false;
          }

          
          
        },
        error: (e) => console.error(e)
      });
  }

  
  

  getmychapter(id: string): void {
      
    this.syllabuservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentchapter = data;
          this.chaptervidoeurl=   this.currentchapter.videourl;
          this.chaptertitle = this.currentchapter.chaptertitle;
          this.chapterattachment = this.currentchapter.attachmenturl;
        },
        error: (e) => console.error(e)
      });
  }

}
