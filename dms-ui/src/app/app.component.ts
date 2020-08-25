import { Component } from '@angular/core';
import { ApiCallService } from './api-call.service';
import * as FusionCharts from 'fusioncharts';

const dataUrl = [
  ['1/4/2011', 100],
  ['2/5/2011', 150],
  ['3/5/2011', 125],
  ['4/5/2011', 150],
  ['5/6/2011', 125],
  ['6/7/2011', 100]
];
const schemaUrl = [
  {
    name: 'Time',
    type: 'date',
    format: '%-m/%-d/%Y'
  },
  {
    name: 'Results',
    type: 'number'
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  patients: any;
  orginzations: any;
  title = 'hapi-fhir-ui';
  email: string;
  isLoggedIn: boolean;
  dataSource: any;
  type: string;
  width: string;
  height: string;
  // constructor(private _service: ApiCallService) {
  //   this.isLoggedIn = this._service.checkCredentials();
  //   this.email=this._service.getEmail();

  // }

  constructor(private _service: ApiCallService) {
    this.isLoggedIn = this._service.checkCredentials();
    this.email = this._service.getEmail();
    this.type = 'timeseries';
    this.width = '700';
    this.height = '400';
    this.dataSource = {
      data: null,
      caption: {
        text: 'Blood Glucose History'
      },
      subcaption: {
        text: 'mg/dL'
      },
      yAxis: [
        {
          plot: {
            value: 'Blood Glucose Level',
            type: 'line'
          },
          format: {
            prefix: ''
          },
          title: 'Glucose Level'
        }
      ]
    };
    this.fetchData();
  }

  logout() {
    this._service.logout();
  }

  fetchData() {
    let jsonify = res => res.json();
    // let dataFetch = fetch(dataUrl).then(jsonify);
    // let schemaFetch = fetch(schemaUrl).then(jsonify);
    Promise.all([dataUrl, schemaUrl]).then(res => {
      let data = res[0];
      let schema = res[1];
      let fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      ); // Instance of DataTable to be passed as data in dataSource
      this.dataSource.data = fusionTable;
    });
  }
}
