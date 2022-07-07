import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  userData: {}[] = [
    {
      id: 1,
      name: 'ABC',
      email: 'taabcrun@gmail.com',
      gender: 'male',
      dob: '2010-08-09',
      profile: '',
      hobbies: 'singing',
      phoneNum: '123-456-7890',
      qualification: ['MCA', 'BCA'],
      profession: 'software Engineer',
      description: 'text description',
      contacts: [
        {
          name: 'Asha',
          number: '123-456-7890',
        },
      ],
    },
    {
      id: 2,
      name: 'Pooja',
      email: 'pooja@gmail.com',
      gender: 'female',
      dob: '1990-06-09',
      profile: '',
      hobbies: 'dancing',
      phoneNum: '123-456-7890',
      qualification: ['MCS', 'BCA'],
      profession: 'Manager',
      description: 'Description Ipsum',
      contacts: [
        {
          name: 'Ram',
          number: '123-456-7890',
        },
        {
          name: 'Arjun',
          number: '123-456-7890',
        },
      ],
    },
    {
      id: 3,
      name: 'Daksh',
      email: 'daksh@gmail.com',
      gender: 'male',
      dob: '2020-04-20',
      profile: '',
      hobbies: 'Playing',
      phoneNum: '123-456-7890',
      qualification: ['10th', '12th'],
      profession: 'student',
      description: 'description',
      contacts: [
        {
          name: 'ridhesh',
          number: '123-456-7890',
        },
        {
          name: 'nayra',
          number: '123-456-7890',
        },
      ]
    }
  ];
  constructor() {}
  dataUpdated = new Subject<{}[]>();
  getData() {
    return this.userData.slice();
    console.log(this.userData);
    
  }

  getUserData(id: number) {
    return this.userData[id];
  }
  addData(newUserInfo: object) {
    this.userData.push(newUserInfo);
  }

  updateData(index: number, newUserData: object) {
    this.userData[index] = newUserData;
    this.dataUpdated.next(this.userData.slice());
  }

  deleteData(index: number) {
    this.userData.splice(index, 1);
    this.dataUpdated.next(this.userData.slice());
  }

  activatedEmitter = new Subject<boolean>();
}
