import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsManagementRoutingModule } from './products-management-routing.module';
import { ProductsManagementComponent } from './products-management.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, 
 } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [ProductsManagementComponent],
  imports: [
    CommonModule,
    ProductsManagementRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule
  ]
})
export class ProductsManagementModule { }
