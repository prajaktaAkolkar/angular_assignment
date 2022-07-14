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
  id: string;
  subscription:Subscription;
  selectedHobby: any = [];
  dropdownList: string[] = [];
  dropdownSettings: IDropdownSettings = {};
  genders:string [] = ['male', 'female'];
 // hobbies: any;
 // profession: string[];
  add: number;
  newData:Post;
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
  user: Post = {
    name: "",
    email: "",
    gender: "",
    dob: "",
    dp: "",
    hobbies: ([] = []),
    phoneNum: "",
    qualification: [],
    profession: "",
    description: "",
    contacts: [],
  };
 

  constructor(
    private regService: RegisterService,
    public dialogRef :MatDialog,
    private dialog  :MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
   
  ) {}

  ngOnInit(): void {
    this.dropdownList = ['MCS', 'BCS', 'M.Pharm', 'B.Pharm', 'Diploma'];
    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false,
    };
   
    
    
  
    this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.editMode = params["id"] != null;
      this.fetchData();
    });
  }

  fetchData() {
    this.regService.getUserData(this.id).subscribe((data) => {
      this.newData = data;
      this.initForm();
    });
  }

  initForm() {
    if (this.editMode) {
      const selectedHobby: string[] = this.newData["hobbies"];
      this.user["phoneNum"]= this.newData["phoneNum"];
      this.fetchSelectedHobby(selectedHobby);
      this.user["name"] = this.newData["name"];
      this.user["email"] = this.newData["email"];
      this.user["gender"] = this.newData["gender"];
      this.user["dob"] = this.newData["dob"];
      this.user["qualification"] = this.newData["qualification"];
      this.user["profession"] = this.newData["profession"];
      this.user["description"] = this.newData["description"];
      if (this.newData["contacts"]) {
        for (let info of this.newData["contacts"]) {
          this.user["contacts"].push(
            new FormGroup({
              name: new FormControl(info["name"], Validators.required),
              number: new FormControl(info["number"], [
                Validators.required,
                Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/),
              ]),
            })
          );
        }
      }
      this.regForm = new FormGroup({
        step1: new FormGroup({
          name: new FormControl(this.user["name"], Validators.required),
          email: new FormControl(this.user["email"], [
            Validators.required,
            Validators.email,
          ]),
          gender: new FormControl(this.user["gender"], Validators.required),
          dob: new FormControl(this.user["dob"], Validators.required),
        }),
        Step2: new FormGroup({
          phoneNum1: new FormControl(this.user["phoneNum"], [
            Validators.required,
            Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/)
          ]),
          hobbies: new FormArray(this.selectedHobby, Validators.required),
          newHobby: new FormControl(""),
        }),
        Step3: new FormGroup({
          qualification: new FormControl(
            this.user["qualification"],
            Validators.required
          ),
          profession: new FormControl(
            this.user["profession"],
            Validators.required
          ),
          description: new FormControl(
            this.user["description"],
            Validators.required
          ),
          contacts: new FormArray(this.user["contacts"], Validators.required),
        }),
      });
    } else {
      this.regForm = new FormGroup({
        step1: new FormGroup({
          name: new FormControl(this.user["name"], Validators.required),
          email: new FormControl(this.user["email"], [
            Validators.required,
            Validators.email,
          ]),
          gender: new FormControl(this.user["gender"], Validators.required),
          dob: new FormControl(this.user["dob"], Validators.required),
        }),
        Step2: new FormGroup({
          dp: new FormControl(null, Validators.required),
          hobbies: new FormArray(this.user["hobbies"], Validators.required),
          newHobby: new FormControl(null),
          phoneNum1: new FormControl("", [
            Validators.required,
            Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/)
          ]),
        }),
        Step3: new FormGroup({
          qualification: new FormControl(
            this.user["qualification"],
            Validators.required
          ),
          profession: new FormControl(
            this.user["profession"],
            Validators.required
          ),
          description: new FormControl(
            this.user["description"],
            Validators.required
          ),
          contacts: new FormArray(
            [
              new FormGroup({
                name: new FormControl(
                  this.user["contacts"].name,
                  Validators.required
                ),
                number: new FormControl(this.user["contacts"].number, [
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
    this.selectedHobby = this.regForm.get("Step2.hobbies") as FormArray;
    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      this.selectedHobby.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
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
    const hobbyName = [];
    for (let hobby of selectedHobby) {
     for (let staticHobby of this.hobbies) {
        hobbyName.push(staticHobby["name"]);
        if (hobby == staticHobby["name"]) {
          staticHobby["selected"] = true;
          this.selectedHobby.push(new FormControl(staticHobby["name"]));
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
    (<FormArray>this.regForm.get("Step3.contacts")).push(
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
    return (<FormArray>this.regForm.get("Step3.contacts")).controls;
  }

  onRemoveContacts(index: number) {
    (<FormArray>this.regForm.get("Step3.contacts")).removeAt(index);
  }

  addHobbies() {
    this.add = 1;
    this.regForm.get("Step2.newHobby")!.setValidators(Validators.required);
    this.cdRef.detectChanges();
  }

  pushHobby() {
    this.hobbies.push({
      id: this.hobbies.length + 1,
      name: this.regForm.value.Step2.newHobby,
      selected: false,
    });
    this.add = 0;
  }

  onCancel() {
    this.add = 0;
  }

  onSubmit() {
    this.user["name"] = this.regForm.value.step1.name;
    this.user["email"] = this.regForm.value.step1.email;
    this.user["gender"] = this.regForm.value.step1.gender;
    this.user["dob"] = this.regForm.value.step1.dob;
    this.user["dp"] = this.regForm.value.Step2.dp;
    this.user["hobbies"] = this.regForm.value.Step2.hobbies;
    this.user["phoneNum"] =
      this.regForm.value.Step2.phoneNum1 ;
    this.user["qualification"] = this.regForm.value.Step3.qualification;
    this.user["profession"] = this.regForm.value.Step3.profession;
    this.user["description"] = this.regForm.value.Step3.description;
    this.user["contacts"] = this.regForm.value.Step3.contacts;

    if (!this.editMode) {
      this.regService.addData(this.user);
    } else {
      this.regService.updateData(this.id, this.user).subscribe();
    }
    this.regService.getData().subscribe();
    this.router.navigate(["/listing"], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onCloseDialog(){
    this.dialogRef.closeAll();
  }
} 

