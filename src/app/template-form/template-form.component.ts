import { Component, OnInit, ViewChild } from '@angular/core';
import {  FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { RegisterService } from '../register.service';
import dataJsb from '../data.json';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTemplateComponent } from '../mat-template/mat-template.component';
@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {
  usersData = [];
  subscription: Subscription;
  editMode: boolean = false;
  dataJ = dataJsb;
  router: any;
  constructor(
    public regservice: RegisterService,
    private route: ActivatedRoute,
    private dialog  :MatDialog
  ) {}

   
  ngOnInit() {
    this.regservice.dataUpdated.subscribe((data) => {
      this.usersData = data;

    });
    this.usersData = this.regservice.getData();
    console.log( this.usersData);
  }
  onCreateTem(index :number){
  //  this.dialog.open(MatTemplateComponent);
  //const TemplateFormComponent =this.router.navigate(['/formEdit/:edit/:index'], { relativeTo: this.route });
    this.dialog.open(MatTemplateComponent);
    }
  onDelete(index: number) {
    this.regservice.deleteData(index);
    //this.dataJ.splice((index), 1);
    console.log("deleted");
  }
  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
