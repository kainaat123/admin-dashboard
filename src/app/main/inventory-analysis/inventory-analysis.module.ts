import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { InventoryAnalysisRoutingModule } from './inventory-analysis-routing.module';
import { InventoryAnalysisComponent } from './inventory-analysis.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgChartsAngularModule } from 'ag-charts-angular';

@NgModule({
  declarations: [InventoryAnalysisComponent],
  imports: [
    CommonModule,
    InventoryAnalysisRoutingModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    AgChartsAngularModule
  ],
})
export class InventoryAnalysisModule {}
