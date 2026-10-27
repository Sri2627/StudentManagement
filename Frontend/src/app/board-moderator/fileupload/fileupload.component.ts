import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/_services/fileUploadService';
 
import { VERSION ,ViewChild } from '@angular/core';


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
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

 
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;


  
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
  imagefilenames :any
  resfilename: any;



  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles();
  }

  // selectFiles(event: any): void {
  //   this.message = [];
  //   this.progressInfos = [];
  //   this.selectedFiles = event.target.files;

  //   this.previews = [];
  //   if (this.selectedFiles && this.selectedFiles[0]) {
  //     const numberOfFiles = this.selectedFiles.length;
  //     for (let i = 0; i < numberOfFiles; i++) {
  //       const reader = new FileReader();

  //       reader.onload = (e: any) => {
  //         console.log(e.target.result);
  //         this.previews.push(e.target.result);
  //       };

  //       reader.readAsDataURL(this.selectedFiles[i]);
  //     }
  //   }
  // }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {

           
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);

            
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: ' + file.name;
            this.message.push(msg);
            this.imageInfos = this.uploadService.getFiles();
debugger
            var res =  event.body;
            console.log(event.body);
            // Converting JSON-encoded string to JS object
            this.resfilename = JSON.parse(res.body);
           
 
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        
        }});
    }
  }

  uploadFiles(): void {
    this.message = [];
  
    if (this.selectedFiles) {
      for (let i = 1; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
       
      }
    }
  }


  
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
        csvRecord.photourl = this.previews[i].trim();
  

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

  uploadListener(event: any): void {

    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }

    let text = [];
    let files = event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = event.target;
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
      this.errorMessage = 'Student account imports are restricted to administrators. Please use the admin account-import workflow.';
      this.isSignUpFailed = true;
      return [];
    }



}
