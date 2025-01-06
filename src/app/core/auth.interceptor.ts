import { inject, Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { STORAGE_KEYS } from '../shared/constants/system.const';
import { NgxSpinnerService } from 'ngx-spinner';
import { clearStore } from '../shared/utilities/system.utils';
import { NotificationService } from '../shared/services/notification.service';
import { AuthServiceService } from '../shared/services/auth-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private count = 0;
  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private notification: NotificationService,
    private injector: Injector,
    private authServices: AuthServiceService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const language = 'vi-VN';

    if (request.url.includes('auth/re-token')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
      });
    } else if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
          'Accept-Language': language,
        },
      });
    }

    if (this.count === 0) this.spinner.show();
    this.count++;
    return next.handle(request).pipe(
      finalize(() => {
        this.count--;
        if (this.count === 0) this.spinner.hide();
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          this.handleError(error);
        }
        return throwError(() => new Error(`${error}`));
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      const dataToken = { refreshToken: refreshToken };
      return this.authServices.retokenLogin(dataToken).pipe(
        switchMap((response: any) => {
          const newToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

          // Clone the original request with the new token
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + newToken,
            },
          });

          // Retry the original request with the new token
          return next.handle(request);
        }),
        catchError((refreshError) => {
          this.notification.error(
            this.injector.get(TranslateService).instant('common.err_system')
          );
          clearStore();
          this.router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    } else {
      clearStore();
      this.router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }
  }

  private handleError(err: HttpErrorResponse) {
    const translate = this.injector.get(TranslateService);
    if (err.status >= 500) {
      const message = translate.instant('common.err_system');
      this.notification.error(message);
    } else if (err.error instanceof Blob) {
      const blob = new Blob([err.error], { type: 'application/json' });
      const reader = new FileReader();
      reader.onload = () => {
        const errorData = JSON.parse(reader.result as string);
        const message = errorData.message;
        this.notification.error(message);
      };
      reader.readAsText(blob);
    } else {
      let message = '';
      if (err.error) {
        const errorDTO = err.error;
        if (errorDTO && (errorDTO.message || errorDTO.code)) {
          message = errorDTO.message;
        }

        if (errorDTO.data) {
          message = errorDTO.data[0].message;
        }
      }
      // nếu lỗi mà có message thì show message
      this.notification.error(message);
    }
  }
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const toastr = inject(NotificationService);
  const injector = inject(Injector);
  const spinner = inject(NgxSpinnerService);
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

  const authServices = inject(AuthServiceService);
  const language = 'vi-VN';
  let request = req;
  let count = 0;

  if (req.url.includes('auth/re-token')) {
    request = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      },
    });
  } else if (token) {
    request = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
        'Accept-Language': language,
      },
    });
  }

  if (count === 0) spinner.show();
  count++;
  return next(request).pipe(
    finalize(() => {
      count--;
      if (count === 0) spinner.hide();
    }),
    catchError((err) => {
      const translate = injector.get(TranslateService);

      if (err.status === 401 && refreshToken) {
        const dataToken = {
          refreshToken: refreshToken,
        };
        return authServices.retokenLogin(dataToken).pipe(
          switchMap((response: any) => {
            const newToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

            // Clone the original request with the new token
            request = request.clone({
              setHeaders: {
                Authorization: 'Bearer ' + newToken,
              },
            });

            // Retry the original request with the new token
            return next(request);
          }),
          catchError((refreshError) => {
            toastr.error(translate.instant('common.err_system'));
            localStorage.clear();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      } else if (err.status >= 400 && err.status < 500 && err.status !== 401) {
        toastr.error(err.error.message);
      } else {
        toastr.error(translate.instant('common.err_system'));
      }
      return throwError(() => err);
    })
  );
};
