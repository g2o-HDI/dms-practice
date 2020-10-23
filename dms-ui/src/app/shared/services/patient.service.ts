import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../endpoints';
import { Observable, throwError } from 'rxjs';
import { FihrPatient } from '../classes/fihr-patient';
import { Observation } from '../classes/observation';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) {}

  /**
  * Search patient from the API by patient's id.
  *
  * @param id number.
  * @returns Observable
  */
  searchPatientById(id: number): Observable<any> {
    return this.http.get<any>(Endpoints.retrievePatientsDataById(id));
  }

  /**
  * Search patient from the API by patient's given name.
  *
  * @param givenName String.
  * @returns Observable
  */
  searchPatientByGivenName(givenName: string): Observable<any> {
    return this.http.get<any>(Endpoints.retrievePatientsDataByGivenName(givenName));
  }

  /**
  * Search patient from the API by patient's family name.
  *
  * @param familyName String.
  * @returns Observable
  */
  searchPatientByFamilyName(familyName: string): Observable<any> {
    return this.http.get<any>(Endpoints.retrievePatientsDataByFamilyName(familyName));
  }

  /**
  * Search patient from the API by patient's given and Family name.
  *
  * @param givenName String.
  * @param familyName String.
  * @returns Observable
  */
  searchPatientByName(givenName: string, familyName: string): Observable<any> {
    console.log(givenName);
    console.log(Endpoints.retrievePatientsDataByGivenName(givenName));
    return this.http.get<any>(Endpoints.retrievePatientsDataByName(givenName, familyName));
  }

  
  fetchBasicPatientData(): Observable<any> {
    return this.http.get<any>(Endpoints.fetchBasicRecord());
  }

  fetchDetailedPatientData(): Observable<any> {
    return this.http.get<any>(Endpoints.fetchDetailedRecord());
  }

  /**
  * Search patient's by patient's id and
  * returns patient's glucose reading from the API.
  *
  * @param id Number.
  * @returns Observable
  */
  fetchGlucoseReadingsForPatient(id: number): Observable<any> {
    return this.http.get<any>(Endpoints.fetchGlucoseReadingsForPatient(id));
  }

  /**
  * Search patient's by patient's id and 
  * returns patient's A1C reading from the API.
  *
  * @param id Number.
  * @returns Observable
  */
  fetchA1CReadingsForPatient(id: number): Observable<any> {
    return this.http.get<any>(Endpoints.fetchA1CReadingsForPatient(id));
  }

  /**
  * Submit data to the API POST call to
  * create a new Glucose observation record for the patient.
  *
  * @param observation Observation.
  * @returns Observable
  */
  submitGlucoseReading(observation: Observation): Observable<any> {  
    const headers = { 'Content-Type': 'application/json'}   
    const body = JSON.stringify(observation);
    return this.http.post(Endpoints.submitObservationReading(), body, { 'headers': headers });
  }

  /**
  * Submit data to the API POST call to 
  * create a new A1C observation record for the patient.
  * 
  * @param observation Observation.
  * @returns Observable
  */
  submitA1CReading(observation: Observation): Observable<any> {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(observation);
    return this.http.post(Endpoints.submitObservationReading(), body, { 'headers': headers });
  }
}
