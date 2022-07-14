import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { response } from 'express';
import { map } from 'rxjs';
import { Post } from './post.model';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  jsonData: Post[]=[]
  // jsonData: {}[] = [
  //   {
  //     id: 1,
  //     name: 'ABC',
  //     email: 'taabcrun@gmail.com',
  //     gender: 'male',
  //     dob: '2010-08-09',
  //     profile: '',
  //     hobbies:['singing', 'dancing'],
  //     phoneNum: '123-456-7890',
  //     qualification: ['MCA', 'BCA'],
  //     profession: 'Software Engineer',
  //     description: 'text description',
  //     contacts: [
  //       {
  //         name: 'Asha',
  //         number: '123-456-7890',
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: 'Pooja',
  //     email: 'pooja@gmail.com',
  //     gender: 'female',
  //     dob: '1990-06-09',
  //     profile: '',
  //     hobbies: ['dancing'],
  //     phoneNum: '123-456-7890',
  //     qualification: ['MCS', 'BCA'],
  //     profession: 'Manager',
  //     description: 'Description Ipsum',
  //     contacts: [
  //       {
  //         name: 'Ram',
  //         number: '123-456-7890',
  //       },
  //       {
  //         name: 'Arjun',
  //         number: '123-456-7890',
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: 'Daksh',
  //     email: 'daksh@gmail.com',
  //     gender: 'male',
  //     dob: '2020-04-20',
  //     profile: '',
  //     hobbies:[ 'Playing'],
  //     phoneNum: '123-456-7890',
  //     qualification: ['10th', '12th'],
  //     profession: 'Civil Engineer',
  //     description: 'description',
  //     contacts: [
  //       {
  //         name: 'ridhesh',
  //         number: '123-456-7890',
  //       },
  //       {
  //         name: 'nayra',
  //         number: '123-456-7890',
  //       },
  //     ]
  //   }
  // ];
 
  constructor( private http : HttpClient) {}
  dataUpdated = new Subject<{}[]>();
  getData() {
    // return this.jsonData.slice();
    // console.log(this.jsonData);
   return this.http.get<{ [key: string]: Post }>("https://angular-assignment-forms-default-rtdb.firebaseio.com/userData.json")
    .pipe(
      map((responseData) =>{
       const userDataArray :Post[] =[];
       for(const key in responseData){
        if(responseData.hasOwnProperty(key))
        {
          userDataArray.push({...responseData[key], id : key})
        }
       }
       return userDataArray;
    }))
    
  }

  getselectedData(userid: string) {
  //  return this.jsonData[id];
   return this.http.get("https://angular-assignment-forms-default-rtdb.firebaseio.com/userData.json?", 
   {
    params:new HttpParams().set('id', userid)
   } 
   ).subscribe(response=>{
    console.log(response);
    
   })
  }

  getUserData(userId: string) {
    return this.http
      .get<Post>(
        "https://angular-assignment-forms-default-rtdb.firebaseio.com/userData/" +
          userId +
          ".json"
      )
      .pipe(
        map((responseData) => {
          let specificUser: Post;
          specificUser = responseData;
          return specificUser;
        })
      );
  }

  addData(newValue: Post) {
    // this.jsonData.push(newValue);
    this.http
      .post(
        "https://angular-assignment-forms-default-rtdb.firebaseio.com/userData.json",
        newValue
      )
      .subscribe(response=>{
        console.log(response)
      });
  }

  updateData(userId: string, newUserData: Post) {
    // this.jsonData[index] = newUserData;
    return this.http.put(
      "https://angular-assignment-forms-default-rtdb.firebaseio.com/userData/" +
        userId +
        ".json",
      newUserData
    );
    this.dataUpdated.next(this.jsonData.slice());
  }

  deleteData(userId: string) {
   // this.jsonData.splice(index, 1);
   // this.dataUpdated.next(this.jsonData.slice());
  return this.http.delete(
    "https://angular-assignment-forms-default-rtdb.firebaseio.com/userData/" +
      userId + 
      ".json"
    )
  }

  activatedEmitter = new Subject<boolean>();
}
