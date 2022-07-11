import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogConfig} from '@angular/material/dialog';
import { MatReactiveComponent } from './mat-reactive/mat-reactive.component';
import { MatTemplateComponent } from './mat-template/mat-template.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular_project';
constructor(private dialog  :MatDialog) {

}
onCreateTem(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus=true;
  this.dialog.open(MatTemplateComponent,dialogConfig);
  }
  onCreateReact(){
    this.dialog.open(MatReactiveComponent);
  }
}
