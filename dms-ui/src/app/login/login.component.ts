import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../api-call.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public isLoggedIn = false;

  constructor(private _service: ApiCallService, private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this._service.checkCredentials();
    let i = window.location.href.indexOf('code');
    if (!this.isLoggedIn && i != -1) {
      this._service.retrieveToken(window.location.href.substring(i + 5));
    }

    if (this.isLoggedIn) {
      this.router.navigate(['dashboard']);
    }
  }

  login() {
    window.location.href = 'http://localhost:8083/auth/realms/EMR/protocol/openid-connect/auth?response_type=code&&scope=write%20read&client_id=' +
      this._service.clientId + '&redirect_uri=' + this._service.redirectUri;
  }

  logout() {
    this._service.logout();
  }
}
