import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../../core/services/alert.service';


@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  alertService = inject(AlertService);
  alerts: Alert[] = [];

  ngOnInit(): void {
    this.alertService.alerts$.subscribe(alert => {
      this.alerts.push(alert);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        this.removeAlert(alert);
      }, 5000);
    });
  }

  removeAlert(alert: Alert): void {
    this.alerts = this.alerts.filter(a => a.id !== alert.id);
  }

  getIcon(type: Alert['type']): string {
    const icons = {
      error: '❌',
      success: '✅',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type];
  }
}