import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResultsEntryComponent } from './lab-results-entry.component';

describe('PatientDetailComponent', () => {
  let component: LabResultsEntryComponent;
  let fixture: ComponentFixture<LabResultsEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabResultsEntryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabResultsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
