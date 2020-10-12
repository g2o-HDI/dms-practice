import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Endpoints } from '../endpoints';
import { Observable } from 'rxjs';
import { FihrPatient } from '../classes/fihr-patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) {}

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
    return this.http.get<any>(Endpoints.fetchGlucoseReadingsForPatient(id));
  }

  submitGlucoseReading(): void {
    // this.http.post();
  }

  submitA1CReading(): void {
    // this.http.post();
  }
}
