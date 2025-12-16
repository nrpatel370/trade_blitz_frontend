import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  alertService = inject(AlertService)

  username = '';
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  errorMessage = '';
  isLoading = false;

  onSubmit(): void {
    if (!this.username || !this.email || !this.password) {
      this.alertService.error("Registration Failed","Please fill in all required fields");
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    }).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.alertService.error("Registration Failed","Please try again.");
        this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}