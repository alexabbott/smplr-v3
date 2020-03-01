import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KitsComponent } from './kits/kits.component';
import { KitComponent } from './kit/kit.component';

const routes: Routes = [
  { path: '', component: KitsComponent },
  { path: 'kit/:slug', component: KitComponent },
  { path: 'new-kit', component: KitComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
