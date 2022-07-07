import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-mat-template',
  templateUrl: './mat-template.component.html',
  styleUrls: ['./mat-template.component.css']
})
export class MatTemplateComponent implements OnInit {

  @ViewChild('form') signUpForm: NgForm;
  editMode: boolean = false;
  id: number;
  dropdownList: string[] = [];
  dropdownSettings: IDropdownSettings = {};
  genders: any[] = ['male', 'female'];
  hobbies: any = ['Traveling','Singing','Cooking','Playing','Reading'];
  profession: string[] = ['Software Engineer','Civil Engineer','Buisness','Teacher'];
  contact: any = [
    {
      id: 1,
      name: '',
      number: '',
    },
  ];

  user: object = {
    userid:this.userDataService.userData.length+1,
    name: '',
    email: '',
    gender: '',
    dob: '',
    profile: '',
    hobbies: [],
    phoneNum: '',
    qualification: [],
    profession: '',
    description: '',
    contacts: [] ,
  };

  constructor(
    private userDataService: RegisterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dropdownList = ['MCA', 'BCA', 'B.tech', 'M.tech', 'B.Com'];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
    };
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.editMode) {
      const newUserData = this.userDataService.getUserData(this.id);
      const selectedHobby: string[] = newUserData['hobbies'];
      this.user['hobby'] = newUserData['hobby'];
      this.user['name'] = newUserData['name'];
      this.user['email'] = newUserData['email'];
      this.user['gender'] = newUserData['gender'];
      this.user['dob'] = newUserData['dob'];
      this.user['phoneNum'] = newUserData['phoneNum'];
      this.user['qualification'] = newUserData['qualification'];
      this.user['profession'] = newUserData['profession'];
      this.user['description'] = newUserData['description'];
      this.contact = newUserData['contacts'];
    }
  }

  getSelectedHobby(): string[] {
    const selectedHobby = [];
    for (let sel of this.hobbies) {
      if (this.signUpForm.value.userDataTwo[sel.id]) {
        selectedHobby.push(sel.name);
      }
    }
    return selectedHobby;
    console.log(selectedHobby);
  }

  fetchSelectedHobby(selectedHobby: string[]) {
    for (let e of selectedHobby) {
      for (let f of this.hobbies) {
        if (e == f['name']) {
          f['selected'] = true;
        }
      }
    }
  }

  onAddContacts() {
    this.contact.push({
      id: this.contact.length + 1,
      contactName: '',
      contactNumber: '',
    });
  }

  onRemoveContacts(index: number) {
    this.contact.splice(index, 1);
  }
  onSubmit() {
    this.user['hobbies'] = this.getSelectedHobby();
    this.user['contacts'] = this.contact
    if (!this.editMode) {
      this.user['userid'] = this.user['userid']++;
      this.userDataService.addData(this.user);
    } else {
      this.userDataService.updateData(this.id, this.user)
    }
    this.router.navigate(['/home'], { relativeTo: this.route });
  }

}
