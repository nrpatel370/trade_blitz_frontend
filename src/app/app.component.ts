import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AlertComponent } from "./shared/components/alert/alert.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AlertComponent],
  template: `
    <app-navbar></app-navbar>
    <app-alert></app-alert>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'Trade Blitz';
}