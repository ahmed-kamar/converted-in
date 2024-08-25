import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    BreadcrumbModule,
    NgClass,
    NgOptimizedImage,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  constructor() {
    this.items = [
      { icon: 'pi pi-home', route: '/' },
      { label: 'Electronics & Mobiles', route: '/' },
      {
        label: 'Sony PlayStation 5 DigitalEdition Console With Controller',
        route: '/',
      },
    ];
  }
}
