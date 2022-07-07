import { Component, OnInit, ViewChild } from '@angular/core';
import {  FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { RegisterService } from '../register.service';
import dataJsb from '../data.json';
@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {
  usersData: {}[] = [];
  subscription: Subscription;
  editMode: boolean = false;
  dataJ = dataJsb;
  constructor(
    
    private regservice: RegisterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.regservice.dataUpdated.subscribe((data) => {
      this.usersData = data;
    });
    this.usersData = this.regservice.getData();
  }
  onDelete(index: number) {
    //this.regservice.deleteData(index);
    this.dataJ.splice((index), 1);
    console.log("deleted");
  }
  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }
}
