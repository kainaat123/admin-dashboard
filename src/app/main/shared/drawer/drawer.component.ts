import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  dynamicMode!: MatDrawerMode;
  isDrawerOpen = true;

  @ViewChild('drawer') public drawer!: MatSidenav;

  constructor() {}

  ngOnInit() {
    this.setDrawerConfigs();
  }

  @HostListener('window:resize', ['$event'])
  onresize() {
    this.setDrawerConfigs();
  }

  /**
   * @name setDrawerConfig
   * @desc Sets drawer configuration as per
   * meta detected
   * @return {void}
   */
  setDrawerConfigs(): void {
    if (window.innerWidth <= 992) {
      this.dynamicMode = 'over';
      this.isDrawerOpen = false;
    } else {
      this.isDrawerOpen = true;
      this.dynamicMode = 'side';
    }
  }
}
