import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { RegisterService } from '../register.service';
import {MatDialog} from '@angular/material/dialog';
import {MatDialogConfig} from '@angular/material/dialog';
import empData from '../data.json';
import { MatTemplateComponent } from '../mat-template/mat-template.component';
import { Post } from '../post.model';
import { response } from 'express';
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
  userId: any;
  selectedHobby: any = [];
  subscription: Subscription;
  dropdownList: string[] = [];
  dropdownSettings: IDropdownSettings = {};
  genders: string[] = ['male', 'female'];
 // hobbies: any = ['Singing','Dancing','Playing']
 hobbies: any = [
  {
    id: 1,
    name: 'Reading',
    selected: false,
  },
  {
    id: 2,
    name: 'Cooking',
    selected: false,
  },
  {
    id: 3,
    name: 'Playing',
    selected: false,
  },
];
   hobbyFlag :boolean = false;
  
  profession: string[] = [
    'Software Engineer',
    'Manager',
    'Self-Employee',
    'Civil Engineer',
    'Buisness',
  ];
  contact: [] = [];

  user: Post = {
   
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
  addhobby: boolean;
  hobbys: any;
  hobbyValue: any;
  add: number;
  constructor(
    private regServiceData: RegisterService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef :MatDialog,
    private dialog  :MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}



  onCreateTem(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus=true;
    this.dialog.open(MatTemplateComponent,dialogConfig);
    }
    onCreateReact(){
      this.dialog.open(MatReactiveComponent);
    }

  ngOnInit(): void {
    this.dropdownList = ['MCS', 'BCS', 'M.Pharm', 'B.Pharm', 'Diploma'];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
    };
    this.route.params.subscribe((params: Params) => {
      this.userId = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.editMode) {
      const newData = this.regServiceData.getselectedData(this.userId );
      const selectedHobby: string[] = newData['hobbies'];
      this.fetchSelectedHobby(selectedHobby);
      this.user['name'] = newData['name'];
      this.user['email'] = newData['email'];
      this.user['gender'] = newData['gender'];
      this.user['dob'] = newData['dob'];
      this.user['phoneNum'] = newData['phoneNum'];
      this.user['qualification'] = newData['qualification'];
      this.user['profession'] = newData['profession'];
      this.user['description'] = newData['description'];
      if (newData['contacts']) {
        for (let info of newData['contacts']) {
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

  addHobby()
{
  console.log("add hobby clicked");
   this.hobbyFlag = true;
  console.log(this.hobbyFlag);

}

getSelectedHobby(event: any) {
  this.selectedHobby = this.regForm.get('step2.hobbies') as FormArray;
  if (event.target.checked) {
   
    this.selectedHobby.push(new FormControl(event.target.value));
  } else {
    let i: number = 0;

    this.selectedHobby.controls.forEach((ctrl: FormControl) => {
      if (ctrl.value == event.target.value) {
        this.selectedHobby.removeAt(i);
        return;
      }
      i++;
    });
  }
}

fetchSelectedHobby(selectedHobby: string[]) {
  const hobbyName = [];
  for (let hobby of selectedHobby) {
    for (let staticHobby of this.hobbies) {
      hobbyName.push(staticHobby['name']);
      if (hobby == staticHobby['name']) {
        staticHobby['selected'] = true;
        this.selectedHobby.push(new FormControl(staticHobby['name']));
      }
    }
    const uniqueHobbyName = [...new Set(hobbyName)];
    if (uniqueHobbyName.includes(hobby) == false) {
      this.selectedHobby.push(new FormControl(hobby));
      this.hobbies.push({
        id: this.hobbies.length + 1,
        name: hobby,
        selected: true,
      });
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
 
  hobbyAdded(){
    return this.addhobby = true;
  
   }
   newhobby() {
    console.log("click it");
    
   }

   hobbyAddByUser(){  
    console.log(this.hobbyValue);
    
    this.hobbies.push({id: this.hobbies.length + 1,
          name: this.hobbyValue,
          selected: false,}); 
    this.addhobby =false;
   }

   getInputHobby(event: Event){

    this.hobbyValue = (<HTMLInputElement>event.target).value;

   }
 
  get controls() {
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
      //this.user['userid'] = this.regServiceData.addData.length + 1;
      this.regServiceData.addData(this.user);
      console.log(this.regForm.value);
    } else {
      this.regServiceData.updateData(this.userId , this.user).subscribe(response=>{
        console.log(response)
      });
    }
    this.regServiceData.getData().subscribe();
    this.router.navigate(['/listing'], { relativeTo: this.route });
    this.onCloseDialog();
  }


  onCloseDialog(){
    this.dialogRef.closeAll();
  }
  }
  

