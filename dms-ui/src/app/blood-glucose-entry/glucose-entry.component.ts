import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
  constructor() {}

  ngOnInit(): void {}
}
