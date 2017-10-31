import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SamplerComponent } from './sampler/sampler.component';

const routes: Routes = [
  { path: '', component: SamplerComponent },
  { path: 'kit/:slug', component: SamplerComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }