import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../api-call.service';
import * as FusionCharts from 'fusioncharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLoggedIn: boolean;
  patients: any;
  orginzations: any;
  title = 'hapi-fhir-ui';

  constructor(private _service: ApiCallService) {}

  logout() {
    this._service.logout();
  }

  // In this method we will create our DataStore and using that we will create a custom DataTable which takes two
  // parameters, one is data another is schema.

  ngOnInit(): void {}
}
