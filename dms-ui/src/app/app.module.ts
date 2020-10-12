import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { GlucoseEntryComponent } from './blood-glucose-entry/glucose-entry.component';
import { LabResultsEntryComponent } from './A1c-lab-results-entry/lab-results-entry.component';
import { MaterialModule } from './shared/modules/material-module';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as TimeSeries from 'fusioncharts/fusioncharts.timeseries';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { InterceptorService } from './shared/services/interceptor.service';

FusionChartsModule.fcRoot(FusionCharts, TimeSeries);

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: PatientSearchComponent },
      { path: 'patient/:id', component: PatientDetailComponent },
      { path: 'glucose-entry', component: GlucoseEntryComponent },
      { path: 'lab-results-entry', component: LabResultsEntryComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PatientSearchComponent,
    PatientDetailComponent,
    GlucoseEntryComponent,
    LabResultsEntryComponent,
    LoginComponent
  ],
  imports: [
    FusionChartsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgbModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [
    FormBuilder,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
