import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from '../_services';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,
    private messageService: MessageService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        localStorage.removeItem('currentUser');
        this.messageService.sendMessage('logout');
        this.router.navigate(['/guest']);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
