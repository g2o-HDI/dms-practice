import { BehaviorSubject } from 'rxjs';
import { FihrPatient } from '../classes/fihr-patient';
import { PatientService } from '../services/patient.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientState {
  constructor(private patientService: PatientService) {}

  private readonly _patients = new BehaviorSubject<any>(null);
  readonly $patients = this._patients.asObservable();

  getPatients(): void {
    this.patientService.getPatients().subscribe(res => {
      this.patients$ = res;
    });
  }

  clearState(): void {
    this.patients$ = null;
  }

  get patients$() {
    return this._patients.getValue();
  }

  set patients$(data: any) {
    this._patients.next(data);
  }
}
