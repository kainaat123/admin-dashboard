import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryAnalysisComponent } from './inventory-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryAnalysisComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryAnalysisRoutingModule { }
