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
  usersData:any = [];
  subscription: Subscription;
  editMode: boolean = false;
  dataJ = dataJsb;
  isFetching :boolean = false
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
    this.isFetching=true;
    this.subscription = this.regservice.getData().subscribe((data) => {
      this.usersData = data;
      this.isFetching = false;
    });
  }
  onCreateTem(index :number){
  //  this.dialog.open(MatTemplateComponent);
  //const TemplateFormComponent =this.router.navigate(['/formEdit/:edit/:index'], { relativeTo: this.route });
    this.dialog.open(MatTemplateComponent);
    }
  onDelete(userId: string) {
   // this.regservice.deleteData(index);
    //this.dataJ.splice((index), 1);
     this.isFetching = true;
     this.regservice.deleteData(userId).subscribe(()=>{
      this.regservice.getData().subscribe((data)=>{
        this.usersData = data;
        this.isFetching =false;
      })
     })

    console.log("deleted");
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
// onDelete(userId: string) {
//   this.loading = true;
//   this.userservice.deleteData(userId).subscribe(() => {
//     this.userservice.getData().subscribe((data) => {
//       this.usersData = data;
//       this.loading = false;
//     });
//   });
// }
// ngOnDestroy(): void {
//   this.subscription.unsubscribe();
// }