import { Component, OnInit } from '@angular/core';
import { VERSION ,ViewChild } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { StudentService } from 'src/app/_services/student.service';


export class CsvData {
  public username: any;
  public email: any;
  public password: any;
  public roles: any;
  public fullname: any;
  public mobile: any;
  public address: any;
  public standard: any;
  public section: any;
  public profile: any;
  public photourl: any;
  public admissionno:any;
 
    
 

}



@Component({
  selector: 'app-csvupload',
  templateUrl: './csvupload.component.html',
  styleUrls: ['./csvupload.component.css']
})
export class CsvuploadComponent implements OnInit {


  name = 'Angular ' + VERSION.major;
  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  jsondatadisplay:any;
  students:any;
  curruntRecord: any;
  csvRecordsArray!: any;
  headersRow!: any;
  userroles: ["user"] | any;
  headerLength: any;
  roles:["user"] | any;

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  totalRecords: any;
  studentData:any;
  nextadmissionno!: number;



  constructor( private studentservice: StudentService, private authService: AuthService) { }

  ngOnInit(): void {

      this.retrieveStudents();
  }


  // uploadListener($event: any): void {

  //   let text = [];
  //   let files = $event.srcElement.files;

  //   if (this.isValidCSVFile(files[0])) {

  //     let input = $event.target;
  //     let reader = new FileReader();
      
  //     reader.readAsText(input.files[0]);

  //     reader.onload = () => {
  //       let csvData = reader.result;
  //       let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

  //       let headersRow = this.getHeaderArray(csvRecordsArray);

  //       //this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
  //       this.records = this.Uploadstudents(csvRecordsArray, headersRow.length);

  //     };

  //     reader.onerror = function () {
  //       console.log('error is occured while reading file!');
  //     };

  //   } else {
  //     alert("Please import valid .csv file.");
  //     this.fileReset();
  //   }
  // }const str = 


  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {

      
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {

        let csvRecord: CsvData = new CsvData();
        csvRecord.admissionno = curruntRecord[7].trim();
        csvRecord.fullname = curruntRecord[1].trim();
        csvRecord.mobile = curruntRecord[2].trim();
        csvRecord.email = curruntRecord[3].trim();
        csvRecord.address = curruntRecord[4].trim();
        csvRecord.standard = curruntRecord[5].trim();
        csvRecord.section = curruntRecord[6].trim();
        csvRecord.photourl = curruntRecord[8].trim();
  

        csvArr.push(csvRecord);
      

      }
    }
    return csvArr;
  }

//check etension
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.jsondatadisplay = '';
  }

  getJsonData(){
 this.jsondatadisplay = JSON.stringify(this.records);
 
  }

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        this.csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        this.headersRow = this.getHeaderArray(this.csvRecordsArray);
        this.headerLength = this.headersRow.length;
        this.records = this.getDataRecordsArrayFromCSVFile(this.csvRecordsArray, this.headersRow.length);
        //this.records = this.Uploadstudents(this.csvRecordsArray, this.headersRow.length);

      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  

 
    Uploadstudents(csvRecordsArray: any, headerLength: any) {
      debugger
      this.retrieveStudents();
      let csvArr = [];
      
      for (let i = 1; i < csvRecordsArray.length; i++) {
        this.nextadmissionno = this.nextadmissionno+1;
        let curruntRecord = (<string>csvRecordsArray[i]).split(',');
        if (curruntRecord.length == headerLength) {
          let csvRecord: CsvData = new CsvData();
          csvRecord.username = curruntRecord[1].trim();
          csvRecord.password = String(this.nextadmissionno);
          csvRecord.roles =   ['user'];
          csvRecord.admissionno = this.nextadmissionno;
          csvRecord.fullname = curruntRecord[1].trim();
          csvRecord.mobile = curruntRecord[2].trim();
          csvRecord.email = curruntRecord[3].trim();
          csvRecord.address = curruntRecord[4].trim();
          csvRecord.standard = curruntRecord[5].trim();
          csvRecord.section = curruntRecord[6].trim();
          csvRecord.profile = curruntRecord[1].trim();
          csvRecord.photourl = curruntRecord[8].trim();
   
           csvArr.push(csvRecord);
           this.authService.register(
            csvRecord.username,
            csvRecord.email,
            csvRecord.password,
            csvRecord.roles, 
            csvRecord.fullname,
            csvRecord.mobile,
            csvRecord.address,
            csvRecord.standard,
            csvRecord.section,
            csvRecord.profile,
            csvRecord.photourl,
            csvRecord.admissionno,
                    )
           .subscribe({
             next: (res) => {
               console.log(res);
                
               //alert(res.message);
             },
             error: (e) => {
              console.error(e);

              this.errorMessage = e.error.message;;

              console.log(this.errorMessage);

             }
           });
 
         console.log(csvRecord);
              
        }
      }
     
      
  alert("Upload completed")
      return csvArr;
  

     
    }

    retrieveStudents(): void {
    
      this.studentservice.getAll()
        .subscribe({
          next: (data) => {
  
 
            this.studentData = data.sort((one:any, two :any) => (one.admissionno > two.admissionno ? 1 : -1));
            this.totalRecords=this.studentData.length;
     
             
            this.nextadmissionno =  Number(this.studentData[this.totalRecords-1].admissionno);
            this.nextadmissionno = this.nextadmissionno;
           
          },
          error: (e) => console.error(e)
        });
    }


}
