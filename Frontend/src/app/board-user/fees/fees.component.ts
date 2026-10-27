import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
import { Invoice } from 'src/app/models/accounts.model';
import { AccountService } from 'src/app/_services/account.service';
import { AuthService } from 'src/app/_services/auth.service';
import { FileUploadService } from 'src/app/_services/fileUploadService';
import { PaymentService } from 'src/app/_services/pay.service';
import { RazorService } from 'src/app/_services/razor.service';
import { StudentService } from 'src/app/_services/student.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.css']
})
export class FeesComponent implements OnInit {


  invocies?: Invoice[];
 
  currentInvoice: Invoice = {
    name: '',
    studentid: '',
    admissionno: '',
    standard: '',
    feeformat: '',
    lastdate: '',
    tutionfee: '',
    transportfee: '',
    termfee: '',
    total: '',
    ispaid:false,
    paymentid: '',
  };

 

  searchterm = "";
  page: number = 1;
  count: number = 0;  
  tableSize: number= 50;
  tableSizes: any = [10, 15, 20, 50, 100];
  currentUser: any;
  totalRecords: any;
  currentTutorial:any;
  paymentHandler: any = null;
  rzp1:any;
  currentdata: Invoice = {
  
  };
  admindata: any;
  currentUserdata: any;
  fullname: any;
  phone: any;
  myemail: any;
  currentorder: any;
  orderid: any;
  paymentid: any;
  invociepaid = false;
  paymentId: any;
  currentInvoiceid: any;
  constructor(
 
    private studentservice:StudentService, 
    private authService: AuthService, 
    private uploadService: FileUploadService,
    private tokenStorage: TokenStorageService, 
    private  accountService: AccountService,
    private paymentService :PaymentService,
    private razorService : RazorService,
    public router: Router
  ) { }

  ngOnInit(): void {

    this.currentUser = this.tokenStorage.getUser();
    this.getmydetails(this.currentUser.id)
    this.getadmindetails();
    this.getmyinvoices(this.currentUser.id);
  
 
  }

  getmydetails(id: string): void {
 
    this.studentservice.get(id)
      .subscribe({
        next: (data) => {
          this.currentUserdata = data;
          this.fullname =this.currentUserdata.fullname;
          this.phone =  this.currentUserdata.mobile;
          this.myemail = this.currentUserdata.email;
          console.log( this.phone);
          console.log(this.fullname);
          console.log( this.myemail);

         },
        error: (e) => console.error(e)
      });
  }


  


payrazor(invoiceid :any, order:any){

 const options = {
    "key": environment.razorpayKeyId,
    "amount": order.amount,
    "currency": "INR",
    "name": "Edu Whale",
    "description": "Edu Whale Transaction",
    "image": `${window.location.origin}/favicon.ico`,
    "order_id": order.id,
    "handler": this.paymentCapture.bind(this),
    
    
    // function (response : any){
    
     
    //     alert(response.razorpay_payment_id);
    //     alert(response.razorpay_order_id);
        //alert(response.razorpay_signature)
        
   
    "prefill": {
        "name": this.fullname,
        "email": this.myemail,
        "contact": "+91"+ this.phone,
    },
    "notes": {
        "address": "Edu Whale Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
 
  this.rzp1 = new this.paymentService.nativeWindow.Razorpay(options);

  this.rzp1.open();


  
}

paymentCapture(response :any) {
  this.razorService.verify({
    invoiceId: this.currentInvoiceid,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature
  }).subscribe({
    next: () => {
      alert("Payment verified and invoice updated.");
      this.getmyinvoices(this.currentUser.id);
    },
    error: error => {
      console.error("Payment verification failed:", error);
      alert(error.error?.message || "Payment could not be verified.");
    }
  });
}



createOrder(invoiceid: any): void {
  if (!environment.razorpayKeyId) {
    alert("Online payments are not configured.");
    return;
  }
  const data = {
    receipt: invoiceid
  };
  this.currentInvoiceid = invoiceid;

  this.razorService.create(data)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.currentorder = res;
        this.orderid = this.currentorder.id;
        this.payrazor(invoiceid, this.currentorder);
   



      },
      error: (e) => console.error(e)
    });

  
 
     
   
}



  getmyinvoices(studentid :any)
    {

      debugger
    
      this.accountService.findByStudentid(studentid)
      .subscribe({
        next: (data) => {
          this.invocies = data;
          this.totalRecords=this.invocies.length;
          console.log(data);
          this.currentTutorial =this.invocies[this.totalRecords-1];
          
        },
        error: (e) => console.error(e)
      });

    }


    getcurrentinvoice(invoiceid :any)
    {

      
    
      this.accountService.get(invoiceid)
      .subscribe({
        next: (data) => {
           
          this.currentdata =  data;
          
        },
        error: (e) => console.error(e)
      });

    }



  onTableDataChange( event: any){
     
    this.page = event;
    this.getmyinvoices(this.currentUser._id);
  }
  onTableSizeChange( event: any){
    this.tableSize= event.target.value;
    this.page = 1;
    this.getmyinvoices(this.currentUser._id);
  }
      
      
  reloadPage(): void {
    window.location.reload();
  }



  Payinvocie(): void {
     
    const data = {
      
      customerid: this.currentUser.id,
      section: this.currentUser.section,
      feeformat : this.currentInvoice.feeformat,
      amount : this.currentInvoice.total
    };

    this.paymentService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          
        },
        error: (e) => console.error(e)
      });

    
     this.reloadPage();
       
     
  }

  

  getadmindetails(){

    const adminid ="62d6a4026ae6ff3978d9d7a9";
    this.studentservice.get(adminid)
    .subscribe({
      next: (data) => {
        this.admindata = data;
 
       
      },
      error: (e) => console.error(e)
    });

  }
  makePayment(amount: any, feeformat:any) {

    this.invokeStripe();

    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51LYOsRSDQaUfYA3CALTWIZHakGxoGSh0g5qCCU725cSCilkbmvfMZI4FcxHGCMdQ8B6iHoTPSlLFWM6ZcyqosMKU00n4ws2w9h',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);  
        alert('Stripe token generated!');
      },
    });




    paymentHandler.open({
      name: "Edu Whale",
      description: feeformat,
      amount: amount * 100,
      email: this.currentUser.email
    });
     
    
  }
  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51LYOsRSDQaUfYA3CALTWIZHakGxoGSh0g5qCCU725cSCilkbmvfMZI4FcxHGCMdQ8B6iHoTPSlLFWM6ZcyqosMKU00n4ws2w9h',
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }



}
