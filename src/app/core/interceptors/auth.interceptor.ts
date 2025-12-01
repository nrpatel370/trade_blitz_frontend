import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('sessionId');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ...(sessionId && { 'X-Session-Id': sessionId })
      }
    });
  }

  return next(req);
};