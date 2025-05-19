import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { DrawerModule } from './shared/drawer/drawer.module';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, MainRoutingModule, DrawerModule,MatIconModule],
})
export class MainModule {}
