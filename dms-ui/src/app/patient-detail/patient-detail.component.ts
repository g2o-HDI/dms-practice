import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { PatientState } from '../shared/state/patient.state';
import { FihrPatient } from '../shared/classes/fihr-patient';
import { ActivatedRoute, Router } from '@angular/router';
import * as FusionCharts from 'fusioncharts';
import { Patient } from '../shared/classes/patient';
import { formatDate } from '@angular/common';
import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit, OnDestroy{
  patient: Patient;
  patientId: number;
  glocuseReadings: any[] = [];
  a1cReadings: any[] = [];
  glucoseDataSource: any;
  a1cDataSource: any;
  type: any;
  width: any;
  height: any;

  schemaUrl = [
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

  dataUrl2 = [
    ['6/1/2019', 75],
    ['7/2/2019', 85],
    ['8/3/2019', 80],
    ['9/4/2019', 70],
    ['10/5/2019', 75],
    ['11/6/2019', 85],
    ['12/7/2019', 80]
  ];

  constructor(private patientState: PatientState, private router: Router, private route: ActivatedRoute) {
    this.type = 'timeseries';
    this.width = '600';
    this.height = '400';
    this.glucoseDataSource = {
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
            value: 'Blood Glucose Level test',
            type: 'line'
          },
          format: {
            prefix: ''
          },
          title: 'Glucose Level'
        }
      ]
    };

    this.a1cDataSource = {
      data: null,
      caption: {
        text: 'A1C History'
      },
      subcaption: {
        text: 'mg/dL'
      },
      yAxis: [
        {
          plot: {
            value: 'A1C Level',
            type: 'line'
          },
          format: {
            prefix: ''
          },
          title: 'A1C Level'
        }
      ]
    };
    this.patientState.searchPatient(this.getParametersData());
    this.handleSubscriptions();
  }

  ngOnInit(): void {
    this.setBloodGlucoseReadings();
    this.setA1CReadings();
  }

  getParametersData() : number {
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
    });
    return this.patientId
  }

  navigateToA1C(): void {
    this.router.navigateByUrl('dashboard/lab-results-entry/'+this.patientId);
  }

  navigateToGlucose(): void {
    this.router.navigateByUrl('dashboard/glucose-entry/'+this.patientId);
  }

  handleSubscriptions(): void {
    this.patientState.$patient.subscribe(patient => {      
      this.patient = new Patient(patient);
      console.log(patient);
    });
  }

 setBloodGlucoseReadings() {
   this.patientState.$glucoseReadingForPatient.subscribe(glucose => {
      glucose?.entry?.map(data => {
        if (data.resource.resourceType == "Observation"){
          const _date = new Date(data.resource.issued);
          this.glocuseReadings.push([
            _date.getMonth() + "/" + _date.getDate() + "/" + _date.getFullYear(),
              data.resource.valueQuantity.value
          ]);
        }
      }); 
     this.buildCharDataForGlocuse();
    });
  }

  setA1CReadings() {
    this.patientState.$a1cReadingForPatient.subscribe(a1c => {
      a1c?.entry?.map(data => {
        console.log(a1c);
        if (data.resource.resourceType == "Observation") {
          const _date = new Date(data.resource.issued);
          this.a1cReadings.push([
            _date.getMonth() + "/" + _date.getDate() + "/" + _date.getFullYear(),
            data.resource.valueQuantity.value
          ]);
        }
      });
      this.buildCharDataForA1C();
    });
  }
 
  buildCharDataForGlocuse() {
      Promise.all([this.glocuseReadings, this.schemaUrl]).then(res => {
      let data = res[0];
      let schema = res[1];
      let fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      ); 
      this.glucoseDataSource.data = fusionTable;
    });
  }

  buildCharDataForA1C() {
    Promise.all([this.a1cReadings, this.schemaUrl]).then(res => {
      let data = res[0];
      let schema = res[1];
      let fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      ); 
      this.a1cDataSource.data = fusionTable;
    });
  }

  ngOnDestroy(): void {
    // this.patientState.clearState();
  }
}
