import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PatientState } from '../shared/state/patient.state';

@Component({
  selector: 'app-lab-results-entry',
  templateUrl: './lab-results-entry.component.html',
  styleUrls: ['./lab-results-entry.component.css']
})
export class LabResultsEntryComponent implements OnInit {
  @ViewChild('readingField') reading: ElementRef;
  @ViewChild('dateField') date: ElementRef;
  @ViewChild('timeField') time: ElementRef;
  @ViewChild('noteField') note: ElementRef;

  constructor(private router: Router, private state: PatientState) {}

  ngOnInit(): void {}

  submit(): void {
    // this.state.submitA1CReading(this.reading, this.date, this.time, this.note);
    this.router.navigateByUrl('dashboard/patient');
  }
}
