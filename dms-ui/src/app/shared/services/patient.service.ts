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

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json;charset=utf-8'
  });

  getPatients(): Observable<any> {
    return this.http.get<any>(Endpoints.retrievePatientData());
  }
}
