import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TemplateFormComponent } from './template-form/template-form.component';
import {ReactiveFormComponent} from './reactive-form/reactive-form.component';
import { MatTemplateComponent } from './mat-template/mat-template.component';
import { MatReactiveComponent } from './mat-reactive/mat-reactive.component';
const routes: Routes = [
  {path:'',component:ReactiveFormComponent},
  {
    path: 'listing',
    component: TemplateFormComponent },
  //{path: 'template', component:MatTemplateComponent},
  {path : 'reactive' , component :MatReactiveComponent},
  { path: 'formEdit/:edit/:id', component: MatReactiveComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
