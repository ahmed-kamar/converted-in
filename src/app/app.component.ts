import { Component } from '@angular/core';
import { HeaderComponent } from './core/components/header/header.component';
import { BreadcrumbComponent } from './core/components/breadcrumb/breadcrumb.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, BreadcrumbComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
