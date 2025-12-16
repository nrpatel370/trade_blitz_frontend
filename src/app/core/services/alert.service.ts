import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert>();
  public alerts$ = this.alertSubject.asObservable();

  showAlert(type: Alert['type'], title: string, message: string): void {
    const alert: Alert = {
      type,
      title,
      message,
      timestamp: new Date(),
      id: Math.random().toString(36).substring(7)
    };
    this.alertSubject.next(alert);
  }

  // Convenience methods
  error(title: string, message: string): void {
    this.showAlert('error', title, message);
  }

  success(title: string, message: string): void {
    this.showAlert('success', title, message);
  }

  warning(title: string, message: string): void {
    this.showAlert('warning', title, message);
  }

  info(title: string, message: string): void {
    this.showAlert('info', title, message);
  }
}