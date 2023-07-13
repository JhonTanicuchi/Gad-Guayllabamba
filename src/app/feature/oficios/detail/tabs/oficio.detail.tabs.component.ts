import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'oficio-detail-tabs',
  templateUrl: './oficio.detail.tabs.component.html',
  styleUrls: ['./oficio.detail.tabs.component.css'],
})
export class OficiosDetailTabsComponent implements OnInit {
  @Input() status: string = '';

  constructor() {}

  ngOnInit(): void {}
}
