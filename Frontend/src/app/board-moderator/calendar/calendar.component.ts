import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { CalendarOptions, getEventClassNames } from '@fullcalendar/angular';
import { EVENT } from 'src/app/models/event.model';
import { EventService } from 'src/app/_services/event.service';
import { Router } from '@angular/router';
 

 


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
 
  Events: EVENT[] = [];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true
    
  };

 
  submitted = false;

 
  currenteventdata: any;
  liveeventdata:any;

  event: EVENT = {
    
    title: '',
    description:'',
    date:'',
    studentid:'',
    customerid:'',
    published:false,
    createdAt:'',
  
  };
  el: any;
  noevents!: boolean;

  constructor(private httpClient: HttpClient,
    public router: Router, 
    private eventservice :EventService,
    
    ) {}
  onDateClick(res: any) {
    //alert('Clicked on date : ' + res.dateStr);
    const date = res.dateStr;
    //alert(date);
    this.getEvent(date);
 
  }
  ngOnInit() {

    this.retrieveEvents();

    setTimeout(() => {
      return this.httpClient
        .get('http://localhost:8080/api/events')
        .subscribe((res: any) => {
          this.Events.push(res);
          console.log(this.Events);
        });
    }, 2200);
    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        dateClick: this.onDateClick.bind(this),
       // events: this.Events,
        events: this.currenteventdata,
      };
    }, 2500);
  }
  
  
  createevent(): void {
     
    const data = {
      title: this.event.title,
      description: this.event.description,
      date: this.event.date,
    };

    this.eventservice.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          
        },
        error: (e) => console.error(e)
      });

    
      this.reloadPage();
       
     
  }
 
  retrieveEvents(): void {
    
    this.eventservice.getAll()
      .subscribe({
        next: (data) => {

          this.currenteventdata = data;
         
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
 
  getEvent ( date : any): void {
    this.eventservice.findBydate(date)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.liveeventdata = res;
          if(this.liveeventdata.length == 0){
            this.noevents = true;

          }
          else{

            this.noevents = false;
          }


        },
        error: (e) =>{
  
          console.error(e);
          alert(e.message);
        }
         
      });
  }

  
  deleteevent( sid : any): void {
  this.eventservice.delete(sid)
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

 
  reloadPage(): void {
    window.location.reload();
  }
}
