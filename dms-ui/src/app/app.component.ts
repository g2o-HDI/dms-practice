import { Component } from '@angular/core';
import { ApiCallService } from './api-call.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  patients: any;
  orginzations: any;
  title = 'hapi-fhir-ui';
  email:string;
  isLoggedIn:boolean;
  constructor(private _service: ApiCallService) {
    this.isLoggedIn = this._service.checkCredentials(); 
    this.email=this._service.getEmail();  

  }
  logout() {
    this._service.logout();
  }


}
