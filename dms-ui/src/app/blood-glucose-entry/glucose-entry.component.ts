import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { PatientState } from '../shared/state/patient.state';

@Component({
  selector: 'app-glucose-entry',
  templateUrl: './glucose-entry.component.html',
  styleUrls: ['./glucose-entry.component.css']
})
export class GlucoseEntryComponent implements OnInit {
  mg = false;
  dL = false;
  @ViewChild('readingField') reading: ElementRef;
  @ViewChild('dateField') date: ElementRef;
  @ViewChild('timeField') time: ElementRef;
  @ViewChild('noteField') note: ElementRef;

  constructor(private router: Router, private state: PatientState) {}

  ngOnInit(): void {}

  onSubmit(): void {
    // this.state.submitGlucoseReading(this.reading, this.date, this.time, this.note);
    this.router.navigateByUrl('dashboard/patient');
  }
}
