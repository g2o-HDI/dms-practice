import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Coding } from '../shared/classes/coding';
import { Observation } from '../shared/classes/observation';
import { ValueQuantity } from '../shared/classes/value-quantity';
import { PatientState } from '../shared/state/patient.state';

@Component({
  selector: 'app-glucose-entry',
  templateUrl: './glucose-entry.component.html',
  styleUrls: ['./glucose-entry.component.css']
})
export class GlucoseEntryComponent implements OnInit {
  units = ["","mg/dL"];
  observation : Observation;
  messageAlert : string;
  messageColor: string;
  patientId: number;

  @ViewChild('glucoseForm') glucoseForm: NgForm;

  constructor(private router: Router, private route: ActivatedRoute, private state: PatientState) {
    this.getParametersData();
    this.observation = new Observation(null);
    this.observation.resourceType = 'Observation';
    this.observation.context = { reference : "Encounter/4" };
    this.observation.subject = { reference : "Patient/" + this.patientId };
    this.observation.valueQuantity = new ValueQuantity(null);
    this.messageColor = 'green';
  }

  get message() { return this.messageAlert; }
  get color() { return this.messageColor;}

  ngOnInit(): void { }
  
  getParametersData(): number {
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
    });
    return this.patientId
  }
  
  back() : void {
    this.router.navigateByUrl('dashboard/patient/' + this.patientId);
  }

  onSubmit(): void {    
    this.observation.valueQuantity.code = this.observation.valueQuantity.unit;
    this.observation.valueQuantity.system = "http://unitsofmeasure.org";
    let code = [
      new Coding({
      system : "http://loinc.org",
      code : "2339-0"
      })
    ];
    this.observation.code = { "coding" : code};
    this.state.submitA1CReading(this.observation);    
    if (this.state.$successMessageAlert != null 
      && this.state.$successMessageAlert){
      this.messageAlert = "Successfully Inserted!";
      this.glucoseForm.resetForm();
    } else {
      this.messageColor = 'red';
      this.messageAlert = "ERROR: Not Inserted Successfully!";
    };
  }

}
