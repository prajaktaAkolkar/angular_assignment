import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { RegisterService } from '../register.service';
import empData from '../data.json';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-mat-reactive',
  templateUrl: './mat-reactive.component.html',
  styleUrls: ['./mat-reactive.component.css']
})
export class MatReactiveComponent implements OnInit {
  regForm: FormGroup;
  editMode: boolean = false;
  id: number;
  selectedHobby: any = [];
  subscription: Subscription;
  dropdownList: string[] = [];
  dropdownSettings: IDropdownSettings = {};
  genders: string[] = ['male', 'female'];
  hobbies: any = ['Singing','Dancing','Playing']
   
  
  profession: string[] = [
    'Software Engineer',
    'Manager',
    'Self-Employee',
    'Civil Engineer',
    'Buisness',
  ];
  contact: [] = [];

  user: object = {
    userid: this.DataService.userData.length,
    name: '',
    email: '',
    gender: '',
    dob: '',
    dp: '',
    hobbies: ([] = []),
    phoneNum: '',
    qualification: [],
    profession: '',
    description: '',
    contacts: [],
  };

  constructor(
    private DataService: RegisterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dropdownList = ['MCS', 'BCS', 'M.Pharm', 'B.Pharm', 'Diploma'];
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
      const newUserData = this.DataService.getUserData(this.id);
      const selectedHobby: string[] = newUserData['hobbies'];
      this.fetchSelectedHobby(selectedHobby);
      this.user['name'] = newUserData['name'];
      this.user['email'] = newUserData['email'];
      this.user['gender'] = newUserData['gender'];
      this.user['dob'] = newUserData['dob'];
      this.user['phoneNum'] = newUserData['phoneNum'];
      this.user['qualification'] = newUserData['qualification'];
      this.user['profession'] = newUserData['profession'];
      this.user['description'] = newUserData['description'];
      if (newUserData['contacts']) {
        for (let info of newUserData['contacts']) {
          this.user['contacts'].push(
            new FormGroup({
              name: new FormControl(info.name, Validators.required),
              number: new FormControl(info.number, [
                Validators.required,
                Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/),
              ]),
            })
          );
        }
      }
      this.regForm = new FormGroup({
        step1: new FormGroup({
          name: new FormControl(this.user['name'], Validators.required),
          email: new FormControl(this.user['email'], [
            Validators.required,
            Validators.email,
          ]),
          gender: new FormControl(this.user['gender'], Validators.required),
          dob: new FormControl(this.user['dob'], Validators.required),
        }),
        step2: new FormGroup({
          hobbies: new FormArray(this.selectedHobby, Validators.required),
          phoneNum: new FormControl(this.user['phoneNum'], Validators.required),
        }),
        step3: new FormGroup({
          qualification: new FormControl(
            this.user['qualification'],
            Validators.required
          ),
          profession: new FormControl(
            this.user['profession'],
            Validators.required
          ),
          description: new FormControl(
            this.user['description'],
            Validators.required
          ),
          contacts: new FormArray(this.user['contacts'], Validators.required),
        }),
      });
    } else {
      this.regForm = new FormGroup({
        step1: new FormGroup({
          name: new FormControl(this.user['name'], Validators.required),
          email: new FormControl(this.user['email'], [
            Validators.required,
            Validators.email,
          ]),
          gender: new FormControl(this.user['gender'], Validators.required),
          dob: new FormControl(this.user['dob'], Validators.required),
        }),
        step2: new FormGroup({
          dp: new FormControl(null, Validators.required),
          hobbies: new FormArray([], Validators.required),
          phoneNum: new FormControl(this.user['phoneNum'], [
            Validators.required,
            Validators.pattern('[0-9]{3}-[0-9]{3}-[0-9]{4}'),
          ]),
        }),
        step3: new FormGroup({
          qualification: new FormControl(
            this.user['qualification'],
            Validators.required
          ),
          profession: new FormControl(
            this.user['profession'],
            Validators.required
          ),
          description: new FormControl(
            this.user['description'],
            Validators.required
          ),
          contacts: new FormArray(
            [
              new FormGroup({
                name: new FormControl(
                  this.user['contacts'].name,
                  Validators.required
                ),
                number: new FormControl(this.user['contacts'].number, [
                  Validators.required,
                  Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/),
                ]),
              }),
            ],
            Validators.required
          ),
        }),
      });
    }
  }

  getSelectedHobby(event: any) {
    this.selectedHobby = this.regForm.get('step2.hobbies') as FormArray;
    if (event.target.checked) {
      // Add a new control in the arrayForm
      this.selectedHobby.push(new FormControl(event.target.value));
    } else {
      let i: number = 0;
      this.selectedHobby.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          this.selectedHobby.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  fetchSelectedHobby(selectedHobby: string[]) {
    for (let sel of selectedHobby) {
      for (let fet of this.hobbies) {
        if (sel == fet['name']) {
          fet['selected'] = true;
          this.selectedHobby.push(new FormControl(fet['name']));
        }
      }
    }
  }

  onAddContacts() {
    (<FormArray>this.regForm.get('step3.contacts')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        number: new FormControl(null, [
          Validators.required,
          Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/),
        ]),
      })
    );
  }

  get controls() {
    // a getter!
    return (<FormArray>this.regForm.get('step3.contacts')).controls;
  }

  onRemoveContacts(index: number) {
    (<FormArray>this.regForm.get('step3.contacts')).removeAt(index);
  }

  onSubmit() {
    this.user['name'] = this.regForm.value.step1.name;
    this.user['email'] = this.regForm.value.step1.email;
    this.user['gender'] = this.regForm.value.step1.gender;
    this.user['dob'] = this.regForm.value.step1.dob;
    this.user['dp'] = this.regForm.value.step2.dp;
    this.user['hobbies'] = this.regForm.value.step2.hobbies;
    this.user['phoneNum'] = this.regForm.value.step2.phoneNum;
    this.user['qualification'] = this.regForm.value.step3.qualification;
    this.user['profession'] = this.regForm.value.step3.profession;
    this.user['description'] = this.regForm.value.step3.description;
    this.user['contacts'] = this.regForm.value.step3.contacts;

    if (!this.editMode) {
      this.user['userid'] = this.DataService.userData.length + 1;
      this.DataService.addData(this.user);
    } else {
      this.DataService.updateData(this.id, this.user);
    }
    this.router.navigate(['/listing'], { relativeTo: this.route });
  }
  }
  

