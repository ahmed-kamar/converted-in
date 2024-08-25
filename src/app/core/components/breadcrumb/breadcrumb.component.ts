import { Component } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { NgClass, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule, NgClass, NgOptimizedImage],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  constructor(public breadcrumbService: BreadcrumbService) {}
}
