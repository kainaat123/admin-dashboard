import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';

/** Below this width the menu slides over the page and opens from a menu button. */
const MOBILE_QUERY = '(max-width: 992px)';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit, OnDestroy {
  dynamicMode: MatDrawerMode = 'side';
  isDrawerOpen = true;
  isMobile = false;

  @ViewChild('drawer') public drawer!: MatSidenav;

  private readonly media = window.matchMedia(MOBILE_QUERY);
  // Only react when the width crosses the breakpoint. A plain resize listener
  // also fires when a phone's address bar hides, which closed the menu.
  private readonly onBreakpoint = (e: MediaQueryListEvent) =>
    this.zone.run(() => this.applyLayout(e.matches));

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.applyLayout(this.media.matches);
    this.media.addEventListener('change', this.onBreakpoint);
  }

  ngOnDestroy(): void {
    this.media.removeEventListener('change', this.onBreakpoint);
  }

  /** On phones, close the menu after picking a page. */
  closeOnMobile(): void {
    if (this.isMobile) this.drawer.close();
  }

  private applyLayout(mobile: boolean): void {
    this.isMobile = mobile;
    this.dynamicMode = mobile ? 'over' : 'side';
    this.isDrawerOpen = !mobile;
  }
}
