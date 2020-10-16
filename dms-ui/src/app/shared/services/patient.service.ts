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

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
  searchPatient(id: number): Observable<any> {
    return this.http.get<any>(Endpoints.retrievePatientsDataById(id));
  }

  getPatients(): Observable<any> {
    return this.http.get<any>(Endpoints.retrieveAllPatientsData());
  }

  fetchBasicPatientData(): Observable<any> {
    return this.http.get<any>(Endpoints.fetchBasicRecord());
  }

  fetchDetailedPatientData(): Observable<any> {
    return this.http.get<any>(Endpoints.fetchDetailedRecord());
  }

  fetchGlucoseReadingsForPatient(id: number): Observable<any> {
    return this.http.get<any>(Endpoints.fetchGlucoseReadingsForPatient(id));
  }

  fetchA1CReadingsForPatient(id: number): Observable<any> {
    return this.http.get<any>(Endpoints.fetchA1CReadingsForPatient(id));
  }

  submitGlucoseReading(observation: Observation): Observable<any> {  
    const headers = { 'Content-Type': 'application/json'}   
    const body = JSON.stringify(observation);
    return this.http.post(Endpoints.submitObservationReading(), body, { 'headers': headers });
  }

  submitA1CReading(observation: Observation): Observable<any> {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(observation);
    return this.http.post(Endpoints.submitObservationReading(), body, { 'headers': headers });
  }
}
