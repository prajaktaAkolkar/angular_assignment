import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MatDialog } from '@angular/material/dialog';
import {StaticDataModel ,Post } from '../post.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-mat-template',
  templateUrl: './mat-template.component.html',
  styleUrls: ['./mat-template.component.css']
})
export class MatTemplateComponent implements OnInit {
  @ViewChild("form") signUpForm: NgForm;
  editMode: boolean = false;
  id: string;
  subscription: Subscription;
  dropdownList: string[] = [];
  dropdownSettings: IDropdownSettings = {};
  genders: string[];
  profession: string[];
  contact: any;
  phoneNum1 = "";
  
  hobbies: any = [];
  add: number;
  newUserData: Post;
  user: any = {
    name: "",
    email: "",
    gender: "",
    dob: "",
    dp: "",
    hobbies: [],
    phoneNum: "",
    qualification: [],
    profession: "",
    description: "",
    contacts: [],
  };
  
  
  constructor(
    private userDataService: RegisterService,
    private staticData: StaticDataModel,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    // this.dropdownList = this.staticData.dropdownList;
    // this.dropdownSettings = this.staticData.dropdownSettings;
    this.dropdownList = ['MCA', 'BCA', 'B.tech', 'M.tech', 'B.Com'];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
    };
    this.contact = this.staticData.contact;
    this.profession = this.staticData.profession;
    this.genders = this.staticData.genders;
    this.hobbies = this.staticData.hobbies;
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.editMode = params["id"] != null;
      this.fetchData();
    });
  }

  fetchData() {
    this.userDataService.getUserData(this.id).subscribe((data) => {
      this.newUserData = data;
      this.initForm();
    });
  }

  initForm() {
    if (this.editMode) {
      const selectedHobby: string[] = this.newUserData["hobbies"];
      this.fetchSelectedHobby(selectedHobby);
      this.user["name"] = this.newUserData["name"];
      this.user["email"] = this.newUserData["email"];
      this.user["gender"] = this.newUserData["gender"];
      this.user["dob"] = this.newUserData["dob"];
      //const phone = this.newUserData["phoneNum"].split("-");
      this.user['phoneNum1'] = this.newUserData['phoneNum'];
      this.user["qualification"] = this.newUserData["qualification"];
      this.user['profession'] = this.newUserData['profession'];
      this.user["description"] = this.newUserData["description"];
      this.contact = this.newUserData["contacts"];
    }
  }

  getSelectedHobby(): string[] {
    const selectedHobby = [];
    for (let e of this.hobbies) {
      if (this.signUpForm.value.userDataTwo[e.id]) {
        selectedHobby.push(e.name);
      }
    }
    return selectedHobby;
  }

  fetchSelectedHobby(selectedHobby: string[]) {
    const hobbyName = [];
    for (let hobby of selectedHobby) {
      for (let staticHobby of this.hobbies) {
        hobbyName.push(staticHobby["name"]);
        if (hobby == staticHobby["name"]) {
          staticHobby["selected"] = true;
        }
      }
      const uniqueHobbyName = [...new Set(hobbyName)];
      if (uniqueHobbyName.includes(hobby) == false) {
        this.hobbies.push({
          id: this.hobbies.length + 1,
          name: hobby,
          selected: true,
        });
      }
    }
  }

  addHobbies() {
    this.add = 1;
  }

  pushHobby(name: string) {
    this.hobbies.push({
      id: this.hobbies.length + 1,
      name: name,
      selected: false,
    });
    this.add = 0;
  }

  onAddContacts() {
    this.contact.push({
      id: this.contact.length + 1,
      name: "",
      number: "",
    });
  }

  onRemoveContacts(index: number) {
    this.contact.splice(index, 1);
  }

  onSubmit() {
   
    this.user["hobbies"] = this.getSelectedHobby();
    this.user["contacts"] = this.contact;
    if (!this.editMode) {
      this.userDataService.addData(this.user);
    } else {
      this.userDataService.updateData(this.id, this.user).subscribe();
    }
    this.userDataService.getData().subscribe();
    this.router.navigate(["/listing"], { relativeTo: this.route });
    this.onCloseDialog();
  }
  onCloseDialog() {
    this.dialogRef.closeAll();
  }

}
