import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PatientState } from '../shared/state/patient.state';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css']
})
export class PatientSearchComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private state: PatientState,
    private router: Router
  ) {}

  @ViewChild('patientIDField') patientIDField: ElementRef;
  patientIDEntered: boolean;
  patientForm: FormGroup;
  subscriptions: Subscription[] = [];
  patientError = '';

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.patientForm = this.fb.group({
      patientID: [
        '',
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]
      ]
    });
  }

  get patientID() {
    return this.patientForm.get('patientID');
  }

  searchPatient(): void {
    this.router.navigateByUrl('dashboard/patient');
  }

  submitForm(): void {
    this.state.clearPatient();
    if (!this.patientID.errors) {
      this.state.searchPatient(this.patientID.value);
      this.searchPatient();
    } else {
      this.patientError = 'Could not find patient. Please try again.';
    }
  }
}
