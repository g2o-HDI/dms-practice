import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PatientState } from '../shared/state/patient.state';
import { Patient } from '../shared/classes/patient';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css']
})
export class PatientSearchComponent implements OnInit {
  
  patientIDEntered: boolean;
  patientForm: FormGroup;
  subscriptions: Subscription[] = [];
  patientError = '';
  patientList: Patient[] = [];

  constructor(
    private fb: FormBuilder,
    private state: PatientState,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      patientID: [
        '',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
      ], patientGivenName: [
        '',
        [Validators.required]
      ], patientFamilyName: [
        '',
        [Validators.required]
      ]
    });
  }

  get patientID() {
    return this.patientForm.get('patientID');
  }
  get patientGivenName() {
    return this.patientForm.get('patientGivenName');
  }
  get patientFamilyName() {
    return this.patientForm.get('patientFamilyName');
  }

  /** 
   * Get patient information by patient id. 
   * Save patients data into the partientList variable.
   */
  getPatientById(): void{
    if (!this.patientID.errors){
      this.state.searchPatientById(this.patientID.value);
      this.state.$patient.subscribe(patient => {
        if (patient === null) {
          this.patientError = 'Could not find patient. Please try again.';
        } else {
          this.patientError = '';
          this.isPatientAlredayExist(patient);
        }
      });
    }
  }

  /**
   * Get patient information by patient given name only.
   * Save patients data into the partientList variable.
   */
  getPatientByGivenName(): void{
    if (!this.patientGivenName.errors && this.patientFamilyName.errors) {
      let givenName = this.patientGivenName.value.replace(/\[/g, '%5B').replace(/\]/g,'%5D');
      this.state.searchPatientByGivenName(givenName);
      this.state.$patientByGiven.subscribe(patient => {
        if (patient === null) {
          this.patientError = 'Could not find patient. Please try again.';
        } else {
          this.patientError = '';
          console.log(patient);
          patient.forEach(patientEntry => {
            this.isPatientAlredayExist(patientEntry.resource);
          });
        }
      });
    }
  }

  /**
   * Get patient information by patient family name only.
   * Save patients data into the partientList variable.
   */
  getPatientByFamilyName(): void {
    if (!this.patientFamilyName.errors && this.patientGivenName.errors) {
        let familyName = this.patientFamilyName.value.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
        this.state.searchPatientByFamilyName(familyName);
        this.state.$patientByFamily.subscribe(patient => {
        if (patient === null) {
          this.patientError = 'Could not find patient. Please try again.';
        } else {
          this.patientError = '';
          patient.forEach(patientEntry => {
            this.isPatientAlredayExist(patientEntry.resource);
          });
        }
      });
    }
  }

  /**
   * Get patient information by patient name (given and family).
   * Family and given name must matches.
   * Save patients data into the partientList variable.
   */
  getPatientByName(): void {
    if (!this.patientGivenName.errors && !this.patientFamilyName.errors) {
    let familyName = this.patientFamilyName.value.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
    let givenName = this.patientGivenName.value.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
    this.state.searchPatientByName(givenName, familyName);
    this.state.$patientByName.subscribe(patient => {
      if (patient === null) {
        this.patientError = 'Could not find patient. Please try again.';
      } else {
        this.patientError = '';
        patient.forEach(patientEntry => {
          this.isPatientAlredayExist(patientEntry.resource);
        });
      }
    });
  }
  }

  /**
   * Validate if the patient data already in the list or not.
   * If not then add it otherwise ignore it.
   * 
   * @param element patient data.
   */
  isPatientAlredayExist(element: any): void {
    const user = this.patientList?.find((patient) => patient.id == element.id);
    if (!user) {
      this.patientList.push(element);
    }
  }

  /**
   * Get patient information by patient name.
   * Save patients data into the partientList variable.
   */
  resetForm() : void{
    this.patientForm.reset();
    this.patientError = "";
  }


  /**
   * Get patient information by patient name.
   * Save patients data into the partientList variable.
   */
  submitForm(): void {
    this.state.clearPatient();
    this.patientList = [];
    if (!this.patientID.errors || 
      !this.patientFamilyName.errors || 
      !this.patientGivenName.errors) {

        this.getPatientById();
        this.getPatientByGivenName();
        this.getPatientByFamilyName();
        this.getPatientByName();
    }
    else {
      this.patientError = 'Input must be required!';
    }
  }
}
