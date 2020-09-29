import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientState } from '../shared/state/patient.state';
import { FihrPatient } from '../shared/classes/fihr-patient';
import { Router } from '@angular/router';
import * as FusionCharts from 'fusioncharts';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  initialReadings = {
    resourceType: 'Bundle',
    id: '767b7c8c-fde2-4ba0-8849-64576bafa1d1',
    meta: {
      lastUpdated: '2020-09-25T10:45:24.190-04:00'
    },
    type: 'searchset',
    total: 3,
    link: [
      {
        relation: 'self',
        url:
          'http://localhost:15437/Observation?Patient=1&code=http%3A%2F%2Floinc.org%7E2339-0'
      }
    ],
    entry: [
      {
        fullUrl: 'http://localhost:15437/Observation/1',
        resource: {
          resourceType: 'Observation',
          id: '1',
          category: [
            {
              coding: [
                {
                  system: 'http://hl7.org/fhir/observation-category',
                  code: 'laboratory',
                  display: 'laboratory'
                }
              ]
            }
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '2339-0',
                display: 'Glucose'
              }
            ],
            text: 'Glucose'
          },
          subject: {
            reference: 'Patient/1'
          },
          context: {
            reference: 'Encounter/2'
          },
          effectiveDateTime: '2020-08-31T20:00:00-04:00',
          issued: '2020-09-24T20:00:00.000-04:00',
          valueQuantity: {
            value: 77,
            unit: 'mg/dL',
            system: 'http://unitsofmeasure.org',
            code: 'mg/dL'
          }
        }
      },
      {
        fullUrl: 'http://localhost:15437/Observation/2',
        resource: {
          resourceType: 'Observation',
          id: '2',
          category: [
            {
              coding: [
                {
                  system: 'http://hl7.org/fhir/observation-category',
                  code: 'laboratory',
                  display: 'laboratory'
                }
              ]
            }
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '2339-0',
                display: 'Glucose'
              }
            ],
            text: 'Glucose'
          },
          subject: {
            reference: 'Patient/1'
          },
          context: {
            reference: 'Encounter/2'
          },
          effectiveDateTime: '2020-09-07T20:00:00-04:00',
          issued: '2020-09-24T20:00:00.000-04:00',
          valueQuantity: {
            value: 85,
            unit: 'mg/dL',
            system: 'http://unitsofmeasure.org',
            code: 'mg/dL'
          }
        }
      },
      {
        fullUrl: 'http://localhost:15437/Observation/3',
        resource: {
          resourceType: 'Observation',
          id: '3',
          category: [
            {
              coding: [
                {
                  system: 'http://hl7.org/fhir/observation-category',
                  code: 'laboratory',
                  display: 'laboratory'
                }
              ]
            }
          ],
          code: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '2339-0',
                display: 'Glucose'
              }
            ],
            text: 'Glucose'
          },
          subject: {
            reference: 'Patient/1'
          },
          context: {
            reference: 'Encounter/2'
          },
          effectiveDateTime: '2020-09-14T20:00:00-04:00',
          issued: '2020-09-24T20:00:00.000-04:00',
          valueQuantity: {
            value: 105,
            unit: 'mg/dL',
            system: 'http://unitsofmeasure.org',
            code: 'mg/dL'
          }
        }
      }
    ]
  };

  patient: any;
  readings: any[] = [];
  type: any;
  width: any;
  height: any;
  dataSource: any;
  type2: any;
  width2: any;
  height2: any;
  dataSource2: any;
  //  varName.entry[0].effectiveDateTime
  //  varName.entry[0].valueQuantity.value

  //   {
  //     "resourceType": "Bundle",
  //     "id": "767b7c8c-fde2-4ba0-8849-64576bafa1d1",
  //     "meta": {
  //         "lastUpdated": "2020-09-25T10:45:24.190-04:00"
  //     },
  //     "type": "searchset",
  //     "total": 3,
  //     "link": [
  //         {
  //             "relation": "self",
  //             "url": "http://localhost:15437/Observation?Patient=1&code=http%3A%2F%2Floinc.org%7E2339-0"
  //         }
  //     ],
  //     "entry": [
  //         {
  //             "fullUrl": "http://localhost:15437/Observation/1",
  //             "resource": {
  //                 "resourceType": "Observation",
  //                 "id": "1",
  //                 "category": [
  //                     {
  //                         "coding": [
  //                             {
  //                                 "system": "http://hl7.org/fhir/observation-category",
  //                                 "code": "laboratory",
  //                                 "display": "laboratory"
  //                             }
  //                         ]
  //                     }
  //                 ],
  //                 "code": {
  //                     "coding": [
  //                         {
  //                             "system": "http://loinc.org",
  //                             "code": "2339-0",
  //                             "display": "Glucose"
  //                         }
  //                     ],
  //                     "text": "Glucose"
  //                 },
  //                 "subject": {
  //                     "reference": "Patient/1"
  //                 },
  //                 "context": {
  //                     "reference": "Encounter/2"
  //                 },
  //                 "effectiveDateTime": "2020-08-31T20:00:00-04:00",
  //                 "issued": "2020-09-24T20:00:00.000-04:00",
  //                 "valueQuantity": {
  //                     "value": 77,
  //                     "unit": "mg/dL",
  //                     "system": "http://unitsofmeasure.org",
  //                     "code": "mg/dL"
  //                 }
  //             }
  //         },
  //         {
  //             "fullUrl": "http://localhost:15437/Observation/2",
  //             "resource": {
  //                 "resourceType": "Observation",
  //                 "id": "2",
  //                 "category": [
  //                     {
  //                         "coding": [
  //                             {
  //                                 "system": "http://hl7.org/fhir/observation-category",
  //                                 "code": "laboratory",
  //                                 "display": "laboratory"
  //                             }
  //                         ]
  //                     }
  //                 ],
  //                 "code": {
  //                     "coding": [
  //                         {
  //                             "system": "http://loinc.org",
  //                             "code": "2339-0",
  //                             "display": "Glucose"
  //                         }
  //                     ],
  //                     "text": "Glucose"
  //                 },
  //                 "subject": {
  //                     "reference": "Patient/1"
  //                 },
  //                 "context": {
  //                     "reference": "Encounter/2"
  //                 },
  //                 "effectiveDateTime": "2020-09-07T20:00:00-04:00",
  //                 "issued": "2020-09-24T20:00:00.000-04:00",
  //                 "valueQuantity": {
  //                     "value": 85,
  //                     "unit": "mg/dL",
  //                     "system": "http://unitsofmeasure.org",
  //                     "code": "mg/dL"
  //                 }
  //             }
  //         },
  //         {
  //             "fullUrl": "http://localhost:15437/Observation/3",
  //             "resource": {
  //                 "resourceType": "Observation",
  //                 "id": "3",
  //                 "category": [
  //                     {
  //                         "coding": [
  //                             {
  //                                 "system": "http://hl7.org/fhir/observation-category",
  //                                 "code": "laboratory",
  //                                 "display": "laboratory"
  //                             }
  //                         ]
  //                     }
  //                 ],
  //                 "code": {
  //                     "coding": [
  //                         {
  //                             "system": "http://loinc.org",
  //                             "code": "2339-0",
  //                             "display": "Glucose"
  //                         }
  //                     ],
  //                     "text": "Glucose"
  //                 },
  //                 "subject": {
  //                     "reference": "Patient/1"
  //                 },
  //                 "context": {
  //                     "reference": "Encounter/2"
  //                 },
  //                 "effectiveDateTime": "2020-09-14T20:00:00-04:00",
  //                 "issued": "2020-09-24T20:00:00.000-04:00",
  //                 "valueQuantity": {
  //                     "value": 105,
  //                     "unit": "mg/dL",
  //                     "system": "http://unitsofmeasure.org",
  //                     "code": "mg/dL"
  //                 }
  //             }
  //         }
  //     ]
  // }

  dataUrl = this.readings;
  // [
  //   ['1/4/2011', 100],
  //   ['2/5/2011', 150],
  //   ['3/5/2011', 125],
  //   ['4/5/2011', 150],
  //   ['5/6/2011', 125],
  //   ['6/7/2011', 100]
  // ];
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
  schemaUrl2 = [
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

  constructor(private patientState: PatientState, private router: Router) {
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
    this.type2 = 'timeseries';
    this.width2 = '700';
    this.height2 = '400';
    this.dataSource2 = {
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
    this.setBloodGlucoseReadings();
    this.fetchData();
    this.fetchA1C();
  }

  setBloodGlucoseReadings(): void {
    this.initialReadings.entry.map(entry => {
      this.readings.push([
        entry.resource.effectiveDateTime,
        entry.resource.valueQuantity.value
      ]);
    });
  }

  ngOnInit(): void {
    this.handleSubscriptions();
  }

  navigateToA1C(): void {
    this.router.navigateByUrl('dashboard/lab-results-entry');
  }

  navigateToGlucose(): void {
    this.router.navigateByUrl('dashboard/glucose-entry');
  }

  handleSubscriptions(): void {
    this.patientState.$patient.subscribe(patient => {
      console.log(patient);
      this.patient = patient;
    });
  }

  fetchData() {
    let jsonify = res => res.json();
    // let dataFetch = fetch(dataUrl).then(jsonify);
    // let schemaFetch = fetch(schemaUrl).then(jsonify);
    Promise.all([this.dataUrl, this.schemaUrl]).then(res => {
      let data = res[0];
      let schema = res[1];
      let fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      ); // Instance of DataTable to be passed as data in dataSource
      this.dataSource.data = fusionTable;
    });
  }

  fetchA1C() {
    let jsonify = res => res.json();
    // let dataFetch = fetch(dataUrl).then(jsonify);
    // let schemaFetch = fetch(schemaUrl).then(jsonify);
    Promise.all([this.dataUrl2, this.schemaUrl2]).then(res => {
      let data = res[0];
      let schema = res[1];
      let fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      ); // Instance of DataTable to be passed as data in dataSource
      this.dataSource2.data = fusionTable;
    });
  }

  ngOnDestroy(): void {
    // this.patientState.clearState();
  }
}
