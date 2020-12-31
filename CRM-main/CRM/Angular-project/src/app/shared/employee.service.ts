import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  selectedEmployee: Employee;
  employees: Employee[];
  readonly baseURL = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) { }

  postEmployee(emp: Employee, token) {
    var header = {
      headers: new HttpHeaders()
        .set('token',  `${token}`)
    }
    return this.http.post(this.baseURL, emp,header);
  }

  getEmployeeList(token) {
    var header = {
      headers: new HttpHeaders()
        .set('token',  `${token}`)
    }
    return this.http.get(this.baseURL,header);
  }

  putEmployee(emp: Employee, token) { 
    var header = {
      headers: new HttpHeaders()
        .set('token',  `${token}`)
    }
    return this.http.put(this.baseURL + `/${emp._id}`, emp, header);
  }

  deleteEmployee(_id: string,token) {
    var header = {
      headers: new HttpHeaders()
        .set('token',  `${token}`)
    }
    return this.http.delete(this.baseURL + `/${_id}`, header);
  }

}
