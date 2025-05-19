import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerRoutingModule } from './drawer-routing.module';
import { DrawerComponent } from './drawer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [DrawerComponent],
  imports: [
    CommonModule,
    DrawerRoutingModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  exports: [DrawerComponent],
})
export class DrawerModule {}
