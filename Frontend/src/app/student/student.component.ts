import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/shared/api.service';
import { StudentModel } from './student.model';
 
import {NgxPaginationModule, PaginationService} from 'ngx-pagination'
import { ngxCsv } from 'ngx-csv/ngx-csv';
import * as XLSX  from 'xlsx';


import { map, Observable } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  public stunderform!: FormGroup;
  studentModelObj: StudentModel = new StudentModel;
  studentData!: any;
  isLoggedIn = false;
  showSave!: boolean;
  showUpdate!:boolean;
  modaltitle!: string;
  searchterm!: any;
  page: number = 1;
  count: number = 0;  
  tableSize: number= 10;
  tableSizes: any = [10, 15, 20, 50, 100];
  title = 'download';
  filename = 'report.xlsx';
  totalRecords: any;

  roles: string[] = [];
 
  currentUser: any;
  

  constructor(public router: Router, private tokenStorage: TokenStorageService,private formbuilder: FormBuilder, private api:ApiService,  public paginate: PaginationService) { }
 

  
  ngOnInit(): void {


    this.currentUser = this.tokenStorage.getUser();
 
 
    this.stunderform = this.formbuilder.group({
      name:[''],
      email:[''],
      mobile:[''],
      fees:[''],
      location:[''],
    })
    this.getAllStudents()
    
  }
  clickAddStudent(){
    this.stunderform.reset();
    this.showSave = true;
    this.showUpdate = false;
    this.modaltitle = "Add New Student";
  }
  postStudentDetails(){ 
    this.studentModelObj.id
    this.studentModelObj.name = this.stunderform.value.name;
    this.studentModelObj.email = this.stunderform.value.email;
    this.studentModelObj.mobile = this.stunderform.value.mobile;
    this.studentModelObj.fees = this.stunderform.value.fees;
    this.studentModelObj.location = this.stunderform.value.location;
  
    this.api.postStudent(this.studentModelObj).subscribe(res=>{
      console.log(res);
      alert("Student record added succeess")
      let ref = document.getElementById('cancel')
      ref?.click();
      this.stunderform.reset();
      this.getAllStudents();
    },
      err=>{alert("Something Went Wrong")}
    
    )


  }
  exportExcel(): void{

    let element = document.getElementById('download');

    const ws:XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb:XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1});

    XLSX.utils.book_append_sheet(wb,ws,'Sheet1')
    XLSX.writeFile(wb,this.filename)

   }
  
  
                        
 
 
    getAllStudents(){
    this.api.getStudents().subscribe(res=>{
    this.studentData = res;
    this.totalRecords=this.studentData.length;
    console.log(this.studentData.length + " Students Loaded");
    
    })
    }
    onTableDataChange( event: any){
   
      this.page = event;
      this.getAllStudents();
    }
    onTableSizeChange( event: any){
      this.tableSize= event.target.value;
      this.page = 1;
      this.getAllStudents();
    }
         
    
    deleteStudent(stu:any){
     
    this.api.deleteStudent(stu.id).subscribe(res=>{
    alert("Student Deleted successfully")
    console.log(stu.id +  " - Student Deleted");
    this.getAllStudents()
    })
    }

    
 
    
    
    
    
  onEdit(stu:any){
    this.showSave = false;
    this.showUpdate = true;
    this.modaltitle = "Student Details";
    this.studentModelObj.id = stu.id;
    this.stunderform.controls['name'].setValue(stu.name);
    this.stunderform.controls['email'].setValue(stu.email);
    this.stunderform.controls['mobile'].setValue(stu.mobile);
    this.stunderform.controls['fees'].setValue(stu.fees);
    this.stunderform.controls['location'].setValue(stu.location);

  }
  updateStudentDetails(){

      this.studentModelObj.name = this.stunderform.value.name;
      this.studentModelObj.email = this.stunderform.value.email;
      this.studentModelObj.mobile = this.stunderform.value.mobile;
      this.studentModelObj.fees = this.stunderform.value.fees;
      this.studentModelObj.location = this.stunderform.value.location;

      this.api.updateStudent(this.studentModelObj,this.studentModelObj.id).subscribe(res=>{
      alert("Student record updated");
      let ref = document.getElementById('cancel')
      ref?.click();
      
      this.stunderform.reset();
       this.getAllStudents();
    
      })
  }

  


}
 