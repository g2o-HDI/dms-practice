import { BehaviorSubject } from 'rxjs';
import { FihrPatient } from '../classes/fihr-patient';
import { PatientService } from '../services/patient.service';
import { Injectable } from '@angular/core';
import { Observation } from '../classes/observation';

@Injectable({
  providedIn: 'root'
})
export class PatientState {
  constructor(private patientService: PatientService) {}

  private readonly _patient = new BehaviorSubject<any>(null);
  readonly $patient = this._patient.asObservable();

  private readonly _patients = new BehaviorSubject<any>(null);
  readonly $patients = this._patients.asObservable();

  private readonly _basicPatientData = new BehaviorSubject<any>(null);
  readonly $basicPatientData = this._basicPatientData.asObservable();

  private readonly _detailedPatientData = new BehaviorSubject<any>(null);
  readonly $detailedPatientData = this._detailedPatientData.asObservable();

  private readonly _glucoseReadingForPatient = new BehaviorSubject<any>(null);
  readonly $glucoseReadingForPatient = this._glucoseReadingForPatient.asObservable();

  private readonly _a1cReadingForPatient = new BehaviorSubject<any>(null);
  readonly $a1cReadingForPatient = this._a1cReadingForPatient.asObservable();

  private readonly _successMessageAlert = new BehaviorSubject<any>(null);
  readonly $successMessageAlert = this._successMessageAlert.asObservable();


  getPatients(): void {
    this.patientService.getPatients().subscribe(res => {
      this.patients$ = res;
    });
  }

  getBasicPatientData(): void {
    this.patientService.fetchBasicPatientData().subscribe(res => {
      this.basicPatientData$ = res;
    });
  }

  searchPatient(id: number): void {
    this.patient$ = null;
    this.patientService.searchPatient(id).subscribe(res => {
      if (res.identifier !== null && res.identifier !== undefined){
        this.patient$ = res;
        this.getGlucoseReadingsForPatient(id);
        this.getA1CReadingsForPatient(id);
      }
    });
  }

  getDetailedPatientData(): void {
    this.patientService.fetchDetailedPatientData().subscribe(res => {
      this.detailedPatientData$ = res;
    });
  }

  getGlucoseReadingsForPatient(id: number): void {
    this.patientService.fetchGlucoseReadingsForPatient(id).subscribe(res => {
      this.glucoseReadingForPatient$ = res;
    });
  }

  getA1CReadingsForPatient(id: number): void {
    this.patientService.fetchA1CReadingsForPatient(id).subscribe(res => {
      this.a1cReadingForPatient$ = res;
    });
  }

  submitGlucoseReading(observation: Observation): void {
    this.successMessageAlert$ = null;
    this.patientService.submitGlucoseReading(observation).subscribe(
      response => this.successMessageAlert$ = true,
        error => console.error(error),
        () => this.successMessageAlert$ = true);
  }

  submitA1CReading(observation: Observation): void {
    this.successMessageAlert$ = null;
    this.patientService.submitA1CReading(observation).subscribe(
      response => this.successMessageAlert$ = true,
      error => console.error(error),
      () => this.successMessageAlert$ = true);
  }

  clearPatient(): void {
    this.patient$ = null;
  }

  clearState(): void {
    this.patients$ = null;
    this.patient$ = null;
    this.detailedPatientData$ = null;
    this.glucoseReadingForPatient$ = null;
    this.basicPatientData$ = null;
  }

  get patient$() {
    return this._patient.getValue();
  }

  set patient$(data: any) {
    this._patient.next(data);
  }

  get patients$() {
    return this._patients.getValue();
  }

  set patients$(data: any) {
    this._patients.next(data);
  }

  get basicPatientData$() {
    return this._basicPatientData.getValue();
  }

  set basicPatientData$(data: any) {
    this._basicPatientData.next(data);
  }

  get detailedPatientData$() {
    return this._detailedPatientData.getValue();
  }

  set detailedPatientData$(data: any) {
    this._detailedPatientData.next(data);
  }

  get glucoseReadingForPatient$() {
    return this._glucoseReadingForPatient.getValue();
  }

  set glucoseReadingForPatient$(data: any) {
    this._glucoseReadingForPatient.next(data);
  }

  get a1cReadingForPatient$() {
    return this._a1cReadingForPatient.getValue();
  }

  set a1cReadingForPatient$(data: any) {
    this._a1cReadingForPatient.next(data);
  }

  get successMessageAlert$() {
    return this._successMessageAlert.getValue();
  }

  set successMessageAlert$(data: any) {
    this._successMessageAlert.next(data);
  }
}
