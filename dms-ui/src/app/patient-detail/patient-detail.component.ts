import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientState } from '../shared/state/patient.state';
import { FihrPatient } from '../shared/classes/fihr-patient';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  patients: any;

  constructor(private patientState: PatientState) {}

  ngOnInit(): void {
    this.patientState.getPatients();
    this.handleSubscriptions();
  }

  handleSubscriptions(): void {
    this.patientState.$patients.subscribe(patients => {
      this.patients = patients;
    });
  }

  ngOnDestroy(): void {
    this.patientState.clearState();
  }
}
