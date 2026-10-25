import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { StudentComponent } from './student/student.component';
import { TeachersComponent } from './teachers/teachers.component';
import { AuthGuard } from './shared/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RoleGuard } from './shared/role.guard';
import { TroleGuard } from './shared/trole.guard';
import { SroleGuard } from './shared/srole.guard';
import { StudentregisterComponent } from './studentregister/studentregister.component';
import { UserComponent } from './user/user.component';
import { ClassroomComponent } from './board-moderator/classroom/classroom.component';
import { MessagesComponent } from './board-moderator/messages/messages.component';
import { SmessagesComponent } from './board-user/smessages/smessages.component';
import { StudentprofileComponent } from './studentprofile/studentprofile.component';
import { AssignmentsComponent } from './board-moderator/assignments/assignments.component';
import { CsvuploadComponent } from './board-admin/csvupload/csvupload.component';
import { AsmtComponent } from './board-user/asmt/asmt.component';
import { FileboxComponent } from './board-user/filebox/filebox.component';
import { ExamComponent } from './board-moderator/exam/exam.component';
import { StudentexamsComponent } from './board-user/studentexams/studentexams.component';
import { FileuploadComponent } from './board-moderator/fileupload/fileupload.component';
import { TfileboxComponent } from './board-moderator/tfilebox/tfilebox.component';
import { BoardAccountsComponent } from './board-accounts/board-accounts.component';
import { AroleGuard } from './shared/arole.guard';
import { FeesComponent } from './board-user/fees/fees.component';
import { SectionsComponent } from './board-admin/sections/sections.component';
import { CalendarComponent } from './board-moderator/calendar/calendar.component';
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
import { ResultchartComponent } from './board-moderator/resultchart/resultchart.component';
import { AdminfilesComponent } from './board-admin/adminfiles/adminfiles.component';
import { SmapleComponent } from './board-admin/smaple/smaple.component';
import { ExamtitlesComponent } from './board-admin/examtitles/examtitles.component';
import { BoardinstituteComponent } from './board-Institution/boardinstitute.component';
import { IroleGuard } from './shared/irole.guard';
import { SchoolsComponent } from './board-Institution/schools/schools.component';
import { VitualtourComponent } from './board-admin/vitualtour/vitualtour.component';

 
 
 
const routes: Routes = [
 
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile/:id', component: StudentprofileComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]  },
  { path: 'user', component: BoardUserComponent,canActivate: [SroleGuard]  },
  { path: 'smessage', component: SmessagesComponent,canActivate: [SroleGuard]  },
  { path: 'assignment', component: AsmtComponent,canActivate: [SroleGuard]  },
  { path: 'filebox', component: FileboxComponent,canActivate: [SroleGuard]  },
  { path: 'fees', component: FeesComponent, canActivate: [SroleGuard] },
  { path: 'myexams', component: StudentexamsComponent, canActivate: [SroleGuard] },
  { path: 'scalendar', component: ScalenderComponent, canActivate: [SroleGuard] },
  { path: 'mysyllabus', component: StudentsyllabusComponent ,canActivate: [SroleGuard] },
  { path: 'videoplayer/:id', component: VideoplayerComponent, canActivate: [SroleGuard]  },
   


  { path: 'mod', component: BoardModeratorComponent, canActivate: [TroleGuard] },
  { path: 'classroom', component: ClassroomComponent, canActivate: [TroleGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [TroleGuard] },
  { path: 'assignments', component: AssignmentsComponent, canActivate: [TroleGuard] },
  { path: 'exams', component: ExamComponent, canActivate: [TroleGuard] },
  { path: 'fileupload', component: FileuploadComponent, canActivate: [TroleGuard] },
  { path: 'tfilebox', component: TfileboxComponent, canActivate: [TroleGuard] },
  { path: 'results/:id', component: ResultComponent, canActivate: [TroleGuard]  },
  { path: 'calendar', component: CalendarComponent, canActivate: [TroleGuard] },
  { path: 'tsyllabus', component: TsyllabusComponent, canActivate: [TroleGuard] },
  { path: 'ExamResults', component: ExamresultsComponent, canActivate: [TroleGuard] },

   { path: 'accounthome', component: BoardAccountsComponent ,canActivate: [AroleGuard] },
   { path: 'accounts', component: AccountsComponent ,canActivate: [AroleGuard] },


   { path: 'examtitles', component: ExamtitlesComponent, canActivate: [RoleGuard] },

  { path: 'resultchart', component: ResultchartComponent, canActivate: [RoleGuard], },
  { path: 'admin', component: BoardAdminComponent ,canActivate: [RoleGuard] },
  { path: 'adminfiles', component: AdminfilesComponent ,canActivate: [RoleGuard] },
  { path: 'student', component: StudentComponent ,canActivate: [RoleGuard] },
  { path: 'userlist', component: UserComponent ,canActivate: [RoleGuard] },
  { path: 'teachers', component: TeachersComponent, canActivate: [RoleGuard] },
  { path: 'csvupload', component: CsvuploadComponent ,canActivate: [RoleGuard] },
  { path: 'sections', component: SectionsComponent ,canActivate: [RoleGuard] },
  { path: 'syllabus', component: SyllabusComponent ,canActivate: [RoleGuard] },
  { path: 'subjects', component: ContentComponent ,canActivate: [RoleGuard] },
  { path: 'virtualtour', component: VitualtourComponent ,canActivate: [RoleGuard] },
  { path: 'admincalendar', component: AdmincalendarComponent ,canActivate: [RoleGuard] },
  { path: 'Unauthorized', component: UnauthorizedComponent },
  { path: 'studentregister', component: StudentregisterComponent },

  { path: 'Institute', component: BoardinstituteComponent ,canActivate: [IroleGuard] },
  { path: 'Schools', component: SchoolsComponent ,canActivate: [IroleGuard] },


  



  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
