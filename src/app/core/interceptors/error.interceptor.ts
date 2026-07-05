import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../shared/components/toast/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly toast = inject(ToastService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'Ocorreu um erro inesperado';

        if (error.status === 0) {
          message = 'Serviço temporariamente indisponível. Verifique sua conexão.';
        } else if (error.status === 404) {
          message = error.error?.detail || 'Recurso não encontrado.';
        } else if (error.status === 400) {
          message = error.error?.detail || 'Dados inválidos.';
        } else if (error.status >= 500) {
          message = 'Erro interno do servidor. Tente novamente mais tarde.';
        }

        this.toast.show(message, 'error');
        return throwError(() => error);
      })
    );
  }
}
