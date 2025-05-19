import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      import('../app/main/main.module').then((m) => m.MainModule),
  },

  {
    path: '**',
    redirectTo: '/authentication',
    pathMatch: 'full',
  },
];
const routerOptions: ExtraOptions = {
  useHash: true,
};
@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
