import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {
  dropdownList:{ item_id: number, item_text: string }[] = [];
  dropdownSettings:IDropdownSettings={};
  form = 0;
  
  constructor() { }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: '12th' },
      { item_id: 2, item_text: 'Diploma(IT)' },
      { item_id: 3, item_text: 'BCS' },
      { item_id: 4, item_text: 'MCS' },
      { item_id: 5, item_text: 'B.E(comp.sci)' },
      { item_id: 6, item_text: 'M.E(comp.sci)' },
      { item_id: 7, item_text: 'MBA' }
    ];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
    };
  }
  
   next(){
    this.form = this.form +1;
   }
   previous(){
    this.form = this.form -1;
   }
}
