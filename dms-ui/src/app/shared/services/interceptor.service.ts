import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  authToken = '';
  subscriptions: Subscription[] = [];
  constructor(private injector: Injector) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      headers: request.headers.set('X-ENVIRONMENT', 'prod')
    });
    if (request.urlWithParams.indexOf('jsonrpc') === -1) {
      request = request.clone({
        headers: request.headers.set('Access-Control-Allow-Origin', '*')
      });
      request = request.clone({
        headers: request.headers.set('BrowserTime', new Date().toString())
      });
      if (!request.headers.has('Content-Type')) {
        request = request.clone({
          headers: request.headers.set(
            'Content-Type',
            'application/fhir+json/charset=UTF-8'
          )
        });
        request = request.clone({
          headers: request.headers.set(
            'Accept',
            'application/fhir+json/charset=UTF-8, application/json, text/plain, */*'
          )
        });
        request = request.clone({
          headers: request.headers.set('Content-Encoding', 'gzip')
        });
        request = request.clone({
          headers: request.headers.set('Transfer-Encoding', 'chunked')
        });
        request = request.clone({
          headers: request.headers.set('Keep-Alive', 'timeout=60')
        });
        request = request.clone({
          headers: request.headers.set('Connection', 'keep-alive')
        });
        request = request.clone({
          headers: request.headers.set(
            'X-Powered-By',
            'HAPI FHIR 5.0.2 REST Server (FHIR Server; FHIR 3.0.2/DSTU3)'
          )
        });
      }
    }
    return next.handle(request);
  }
}
