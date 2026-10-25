import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { StudentComponent } from './student/student.component';
import { TeachersComponent } from './teachers/teachers.component';
import { NgxPaginationModule } from 'ngx-pagination';
import *  as  XLSX from "xlsx";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { StudentregisterComponent } from './studentregister/studentregister.component';
 
import { UserComponent } from './user/user.component';
import { ClassroomComponent } from './board-moderator/classroom/classroom.component';
import { MessagesComponent } from './board-moderator/messages/messages.component';
import { SmessagesComponent } from './board-user/smessages/smessages.component';
import { StudentprofileComponent } from './studentprofile/studentprofile.component';
import { AssignmentsComponent } from './board-moderator/assignments/assignments.component';
import { CsvuploadComponent } from './board-admin/csvupload/csvupload.component';
 

import { OrderModule } from 'ngx-order-pipe';
 
import { AsmtComponent } from './board-user/asmt/asmt.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { FileboxComponent } from './board-user/filebox/filebox.component';
import { ExamComponent } from './board-moderator/exam/exam.component';
 
import { StudentexamsComponent } from './board-user/studentexams/studentexams.component';
import { FileuploadComponent } from './board-moderator/fileupload/fileupload.component';
import { TfileboxComponent } from './board-moderator/tfilebox/tfilebox.component';
import { BoardAccountsComponent } from './board-accounts/board-accounts.component';
import { FeesComponent } from './board-user/fees/fees.component';
import { SectionsComponent } from './board-admin/sections/sections.component';
import { CalendarComponent } from './board-moderator/calendar/calendar.component';
 
 
import { FullCalendarModule } from '@fullcalendar/angular'; 
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SubjectsComponent } from './board-admin/subjects/subjects.component';
import { ScalenderComponent } from './board-user/scalender/scalender.component';
import { SyllabusComponent } from './board-admin/syllabus/syllabus.component';
import { StudentsyllabusComponent } from './board-user/studentsyllabus/studentsyllabus.component';
import { ContentComponent } from './board-admin/content/content.component';
import { AdmincalendarComponent } from './board-admin/admincalendar/admincalendar.component';
import { ResultComponent } from './board-moderator/result/result.component';
import { AccountsComponent } from './board-accounts/accounts/accounts.component';
import { TsyllabusComponent } from './board-moderator/tsyllabus/tsyllabus.component';
import { VideoplayerComponent } from './board-user/videoplayer/videoplayer.component';
import { ExamresultsComponent } from './board-moderator/examresults/examresults.component';
import { NgxPrintModule } from 'ngx-print';
import { ResultchartComponent } from './board-moderator/resultchart/resultchart.component';
import { AdminfilesComponent } from './board-admin/adminfiles/adminfiles.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SmapleComponent } from './board-admin/smaple/smaple.component';
import { ExamtitlesComponent } from './board-admin/examtitles/examtitles.component';
import { BoardinstituteComponent } from './board-Institution/boardinstitute.component';
import { SchoolsComponent } from './board-Institution/schools/schools.component';
import { VitualtourComponent } from './board-admin/vitualtour/vitualtour.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
  

 
FullCalendarModule.registerPlugins([ 
  interactionPlugin,
  dayGridPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    StudentComponent,
    TeachersComponent,
    UnauthorizedComponent,
    StudentregisterComponent,
    UserComponent,
    ClassroomComponent,
    MessagesComponent,
    SmessagesComponent,
    StudentprofileComponent,
    AssignmentsComponent,
    CsvuploadComponent,
    AsmtComponent,
    FileboxComponent,
    ExamComponent,
  
    StudentexamsComponent,
       FileuploadComponent,
       TfileboxComponent,
       BoardAccountsComponent,
       FeesComponent,
       SectionsComponent,
       CalendarComponent,
       SubjectsComponent,
       ScalenderComponent,
       SyllabusComponent,
       StudentsyllabusComponent,
       ContentComponent,
       AdmincalendarComponent,
       ResultComponent,
       AccountsComponent,
       TsyllabusComponent,
       VideoplayerComponent,
       ExamresultsComponent,
       ResultchartComponent,
       AdminfilesComponent,
       SmapleComponent,
       ExamtitlesComponent,
       BoardinstituteComponent,
       SchoolsComponent,
       VitualtourComponent,
  
 
  
      
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    OrderModule,
    FullCalendarModule,
    NgxPrintModule,
    ImageCropperModule,
    
 
   
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
