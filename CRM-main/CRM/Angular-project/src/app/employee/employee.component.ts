import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';


import { EmployeeService } from '../shared/employee.service';
import { Employee } from '../shared/employee.model';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';

declare var M: any;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EmployeeService]
})
export class EmployeeComponent implements OnInit {

  constructor(public employeeService: EmployeeService) { }

  ngOnInit() {
    this.resetForm();
    this.refreshEmployeeList();
  }

  resetForm(form?: NgForm) {
    if (form)
      form.reset();
    this.employeeService.selectedEmployee = { 
      _id: "",
      name: "",
      position: "",
      office: "",
      salary: null 
    }
  }

  onSubmit(form: NgForm) {
    const token = localStorage.getItem('access_token');
    if (form.value._id == "") {
      this.employeeService.postEmployee(form.value,token).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Saved successfully', classes: 'rounded' });
      });
    }
    else {
      this.employeeService.putEmployee(form.value,token).subscribe((res) => {
        this.resetForm(form);
        this.refreshEmployeeList();
        M.toast({ html: 'Updated successfully', classes: 'rounded' });
      });
    }
  }

  refreshEmployeeList() {
    const token = localStorage.getItem('access_token')
    this.employeeService.getEmployeeList(token).subscribe((res) => {
      this.employeeService.employees = res as Employee[];
    });
  }

  onEdit(emp: Employee) {
    this.employeeService.selectedEmployee = emp;
  }

  onDelete(_id: string, form: NgForm) {
    const token = localStorage.getItem('access_token')
    if (confirm('Are you sure to delete this record ?') == true) {
      this.employeeService.deleteEmployee(_id,token).subscribe((res) => {
        this.refreshEmployeeList();
        this.resetForm(form);
        M.toast({ html: 'Deleted successfully', classes: 'rounded' });
      });
    }
  }

}