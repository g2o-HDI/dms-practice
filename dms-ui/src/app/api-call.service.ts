import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';

import { Cookie } from 'ng2-cookies';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class ApiCallService {
  public jwtHelper = new JwtHelperService();
  public clientId = 'DMS-UI';
  public redirectUri = 'http://localhost:4200/';
  
  constructor(private _http: HttpClient) { }

  searchPatients(): Observable<any> {
    var headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 
      'Authorization': 'Bearer '+Cookie.get('access_token')});
    return this._http.get("http://localhost:8080/Patient/",{headers:headers});
  }

  getPatient(id:string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 
      'Authorization': 'Bearer '+Cookie.get('access_token')});
    return this._http.get("http://localhost:8080/Patient/"+id,{headers:headers});
  }
  searchOrgs(): Observable<any> {
    return this._http.get("http://localhost:8080/Organization/");
  }

  retrieveToken(code) {
    let params = new URLSearchParams();   
    params.append('grant_type','authorization_code');
    params.append('client_id', this.clientId);
    params.append('client_secret', 'DMSUICLientSecret');
    params.append('redirect_uri', this.redirectUri);
    params.append('code',code);

    let headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 'Authorization': 'Basic '+btoa(this.clientId+":secret")});
     this._http.post('http://localhost:8083/auth/realms/EMR/protocol/openid-connect/token', params.toString(), { headers: headers })
    .subscribe(
      data => this.saveToken(data),
      err => alert('Invalid Credentials')
    ); 
  }
 
  saveToken(token) {
    var expireDate = new Date().getTime() + (1000 * token.expires_in);
    Cookie.set("access_token", token.access_token, expireDate);
    console.log('Obtained Access token');
    window.location.href = 'http://localhost:4200';
  }
 
  getResource(resourceUrl) : Observable<any> {
    var headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 
      'Authorization': 'Bearer '+Cookie.get('access_token')});
    return this._http.get(resourceUrl, { headers: headers }).pipe(catchError(error=>Observable.throw(error.json().error || 'Server error')));
  }
 
  checkCredentials() {
    return Cookie.check('access_token');
  } 
 
  logout() {
    Cookie.delete('access_token');
    window.location.reload();
  }

  getEmail(){
    var token = Cookie.get("access_token");
    
    var payload = this.jwtHelper.decodeToken(token);
    console.log(payload);
    return payload?.preferred_username;
  }
}
