import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: () =>
      import('../main/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'inventory',
        loadChildren: () =>
          import(
            '../../app/main/inventory-analysis/inventory-analysis.module'
          ).then((m) => m.InventoryAnalysisModule),
      },
      {
        path: 'products/:id',
        loadChildren: () =>
          import(
            '../../app/main/products-management/products-management.module'
          ).then((m) => m.ProductsManagementModule),
      },
      {
        path: 'products',
        loadChildren: () =>
          import(
            '../../app/main/products-management/products-management.module'
          ).then((m) => m.ProductsManagementModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'authentication',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
