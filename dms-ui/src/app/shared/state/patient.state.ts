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

  private readonly _patientByGiven = new BehaviorSubject<any>(null);
  readonly $patientByGiven = this._patientByGiven.asObservable();

  private readonly _patientByFamily = new BehaviorSubject<any>(null);
  readonly $patientByFamily = this._patientByFamily.asObservable();

  private readonly _patientByName = new BehaviorSubject<any>(null);
  readonly $patientByName = this._patientByName.asObservable();

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

  getBasicPatientData(): void {
    this.patientService.fetchBasicPatientData().subscribe(res => {
      this.basicPatientData$ = res;
    });
  }

  /** 
   * Search patient by patient's id. 
   * Save patient information in the patient$ variable.
   * 
   * @param id Number.
   */
  searchPatientById(id: number): void {
    this.patient$ = null;
    this.patientService.searchPatientById(id).subscribe(res => {
      if (res.identifier !== null && res.identifier !== undefined){
        this.patient$ = res;
        this.getGlucoseReadingsForPatient(id);
        this.getA1CReadingsForPatient(id);
      }
    });
  }

  /**
   * Search patient by patient's given name.
   * Save patient information in the patientByGiven$ variable.
   *
   * @param givenName String.
   */
  searchPatientByGivenName(givenName: string): void {
    this.patientByGiven$ = null;
    this.patientService.searchPatientByGivenName(givenName).subscribe(res => {
      if (res.entry !== null && res.entry !== undefined) {
        this.patientByGiven$ = res.entry;
      }
    });
  }

  /**
  * Search patient by patient's family name.
  * Save patient information in the patientByFamily$ variable.
  *
  * @param familyName String.
  */
  searchPatientByFamilyName(familyName: string): void {
    this.patientByFamily$ = null;
    this.patientService.searchPatientByFamilyName(familyName).subscribe(res => {
      if (res.entry !== null && res.entry !== undefined) {
        this.patientByFamily$ = res.entry;
      }
    });
  }

  /**
  * Search patient by patient's given and family name.
  * Save patient information in the patientByName$ variable.
  *
  * @param givenName String.
  * @param familyName String.
  */
  searchPatientByName(givenName: string, familyName: string): void {
    this.patientByName$ = null;
    this.patientService.searchPatientByName(givenName, familyName).subscribe(res => {
      if (res.entry !== null && res.entry !== undefined) {
        this.patientByName$ = res.entry;
      }
    });
  }

  getDetailedPatientData(): void {
    this.patientService.fetchDetailedPatientData().subscribe(res => {
      this.detailedPatientData$ = res;
    });
  }

  /**
  * Search patient's Glucose reading observarion by patient's id.
  * Save the results into the glucoseReadingForPatient$ variable.
  *
  * @param id Number.
  */
  getGlucoseReadingsForPatient(id: number): void {
    this.patientService.fetchGlucoseReadingsForPatient(id).subscribe(res => {
      this.glucoseReadingForPatient$ = res;
    });
  }

  /**
  * Search patient's A1C reading observarion by patient's id.
  * Save the results into the a1cReadingForPatient$ variable.
  *
  * @param id Number.
  */
  getA1CReadingsForPatient(id: number): void {
    this.patientService.fetchA1CReadingsForPatient(id).subscribe(res => {
      this.a1cReadingForPatient$ = res;
    });
  }

  /**
  * Create new A1C reading observation for patient.
  *
  * @param observation Observation.
  */
  submitGlucoseReading(observation: Observation): void {
    this.successMessageAlert$ = null;
    this.patientService.submitGlucoseReading(observation).subscribe(
      response => this.successMessageAlert$ = true,
        error => console.error(error),
        () => this.successMessageAlert$ = true);
  }

  /**
  * Create new A1C reading observation for patient.
  *
  * @param observation Observation.
  */
  submitA1CReading(observation: Observation): void {
    this.successMessageAlert$ = null;
    this.patientService.submitA1CReading(observation).subscribe(
      response => this.successMessageAlert$ = true,
      error => console.error(error),
      () => this.successMessageAlert$ = true);
  }

  /**
   * Clear the patient information.
   */
  clearPatient(): void {
    this.patient$ = null;
    this.patients$ = null;
    this.patientByGiven$ = null;
    this.patientByFamily$ = null;
    this.patientByName$ = null;
  }

  /**
  * Clear the state of all observable.
  */
  clearState(): void {
    this.patients$ = null;
    this.patient$ = null;
    this.patientByGiven$ = null;
    this.patientByFamily$ = null;
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

  get patientByGiven$() {
    return this._patientByGiven.getValue();
  }

  set patientByGiven$(data: any) {
    this._patientByGiven.next(data);
  }

  get patientByFamily$() {
    return this._patientByFamily.getValue();
  }

  set patientByFamily$(data: any) {
    this._patientByFamily.next(data);
  }

  get patientByName$() {
    return this._patientByName.getValue();
  }

  set patientByName$(data: any) {
    this._patientByName.next(data);
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
