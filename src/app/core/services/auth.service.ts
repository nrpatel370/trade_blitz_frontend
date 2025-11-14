import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkStoredSession();
  }

  // R-0008: Check for saved session on app load
  private checkStoredSession(): void {
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId');
    
    if (token && sessionId) {
      this.verifySession().subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.currentUserSubject.next(response.user);
            this.isAuthenticatedSubject.next(true);
          } else {
            this.clearSession();
          }
        },
        error: () => this.clearSession()
      });
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  logout(): void {
    const sessionId = localStorage.getItem('sessionId');
    
    this.http.post(`${this.apiUrl}/logout`, { sessionId }).subscribe({
      complete: () => {
        this.clearSession();
        this.router.navigate(['/']);
      }
    });
  }

  verifySession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify`);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('sessionId', response.sessionId);
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}