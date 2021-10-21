import React, { Component } from 'react'
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { ChangeEvent } from 'react';
import { RouteComponentProps } from 'react-router';
import { EditEmployeeI } from './EditEmployeeInterface';
import _ from 'lodash';

class EditEmployee extends Component<RouteComponentProps,EditEmployeeI> {
    constructor(props: RouteComponentProps) {
        super(props)
    
        this.onChangeEmployeeFirstName = this.onChangeEmployeeFirstName.bind(this);
        this.onChangeEmployeeLastName = this.onChangeEmployeeLastName.bind(this);
        this.onChangeEmployeeEmail = this.onChangeEmployeeEmail.bind(this);
        this.onChangeEmployeeRole = this.onChangeEmployeeRole.bind(this);
        this.submitForm =  this.submitForm.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);

        // State
        this.state = {
            employee:{
                firstname: "",
                lastname: "",
                role: "",
                email: "",
            }
            
        }
    }
    
    public componentWillMount(): void {const api_url = 'http://localhost:7000/employees/data/' + this.getid();
        console.log(api_url);
        axios.get(api_url).then(response => {
            this.setState({employee: response.data as any});
        });
    }

    getid(){
        var url = window.location.href;
        var location = url.lastIndexOf('/');
        var result = url.substring(location + 1);
        return result;
    }
    
    onChangeEmployeeFirstName(e: ChangeEvent<HTMLInputElement>) {
        var employee = {...this.state.employee}
        if(!e.target.value.match((/^[a-zA-Z]+$/)) || e.target.value.length < 3){
            document.getElementById("firstnameErr")!.innerHTML = "Please insert a valid first name!" + "<br />" + 
             "Can't add numbers or expressions for your first name" + "<br />" + 
             "At least three letters must exist as first name. Add another letter before changing the remaining three letters"
        }
        else{
            document.getElementById("firstnameErr")!.innerHTML = "";
            employee.firstname = e.target.value;
            this.setState({employee});
        }
    };
    
    onChangeEmployeeLastName(e: ChangeEvent<HTMLInputElement>) {
        var employee = {...this.state.employee}
        if(!e.target.value.match((/^[a-zA-Z]+$/)) || e.target.value.length < 3){
            document.getElementById("lastnameErr")!.innerHTML = "Please insert a valid last name!" + "<br />" + 
             "Can't add numbers or expressions for your last name" + "<br />" + 
             "At least three letters must exist as last name. Add another letter before changing the remaining three letters"
        }
        else{
            document.getElementById("lastnameErr")!.innerHTML = "";
            employee.lastname = e.target.value;
            this.setState({employee});
        }
    }

    onChangeEmployeeRole(e: ChangeEvent<HTMLInputElement>) {
        var employee = {...this.state.employee}
        employee.role = e.target.value;
        this.setState({employee});
    }

    onChangeEmployeeEmail(e: ChangeEvent<HTMLInputElement>) {
        var employee = {...this.state.employee}
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regEmail.test(e.target.value)) {
            //alert("Please insert a valid email!");
             document.getElementById("emailErr")!.innerHTML = "Please insert a valid email!" + "<br />" + 
             "Can't remove '@'" + "<br />" + 
             "Last element before '@' and first element after '@' must be a letter. Add another letter before changing that element" + "<br />" + 
             "Two letters must exist after the last '.'. Add another letter before changing those remaining two letters" + "<br />" + 
             "First element of email can't start with '@'. Add another letter before changing that first element";
        }
        else{
            document.getElementById("emailErr")!.innerHTML = "";
            employee.email = e.target.value;
            this.setState({employee});
        }
        
    }

    submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        // Preventing the page from reloading
        event.preventDefault();

        const employeeObject = {
            firstname: this.state.employee.firstname,
            lastname: this.state.employee.lastname,
            role: this.state.employee.role,
            email: this.state.employee.email
        };
            var url = window.location.href;
            var location = url.lastIndexOf('/');
            var result = url.substring(location + 1);
            var result_int: number = +result;
            console.log(result);

            axios.put('http://localhost:7000/employees/update/'+ result_int, employeeObject)
            .then((res) => {
                console.log(res.data)
                alert('Employee successfully updated');
                window.location.href = 'http://localhost:3000/employee-list';
            }).catch((error) => {
                if (error.response) {
                    alert(error.response.data);
                    window.location.href = 'http://localhost:3000/edit-employee/' + result
                } else if (error.request) {
                    
                } else {
                }
            })
    
    } 
    
    deleteEmployee(id: any) {
        axios.delete('http://localhost:7000/employees/delete/' + id)
            .then((res) => {
                alert('Employee successfully deleted!')
                window.location.href = 'http://localhost:3000/employee-list';
            }).catch((error) => {
                console.log(error)
            })
    }

    render() {

        var isEnabled =  this.state.employee.firstname.length > 0 && this.state.employee.lastname.length > 0 && 
        this.state.employee.role.length > 0 && this.state.employee.email.length > 0;
    
        let singleEmployee = this.state.employee;
        console.log(singleEmployee);

        return (
        <div className="form-wrapper">

          <Form onSubmit={this.submitForm} style={{
                width: "100%",
                paddingLeft: "8px",
                paddingTop: "30px",
                paddingBottom: "6px"
                }}>
          
            <Form.Group controlId="firstname" onChange={this.onChangeEmployeeFirstName}>
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" value = {singleEmployee.firstname} />
                <Form.Label id="firstnameErr"></Form.Label>
            </Form.Group>

            <br/ >
            <Form.Group controlId="lastname" onChange={this.onChangeEmployeeLastName}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" value = {singleEmployee.lastname}/>
                <Form.Label id="lastnameErr"></Form.Label>
            </Form.Group>        

            <br/ >
            <Form.Group controlId="role" onChange={this.onChangeEmployeeRole}>
                <Form.Label>Role</Form.Label>
                <Form.Control type="text" value = {singleEmployee.role}/>
                <Form.Label id="roleErr"></Form.Label>
            </Form.Group>

            <br/ >
            <Form.Group controlId="email" onChange={this.onChangeEmployeeEmail}>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value = {singleEmployee.email}/>
                <Form.Label id="emailErr"></Form.Label>
            </Form.Group>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <br/ >
            <Button disabled={!isEnabled} variant="danger" size="lg" type="submit">
                Update Employee
            </Button>
            
            &nbsp;&nbsp;&nbsp;&nbsp;
            
            <Button onClick={() => this.deleteEmployee(this.getid())} size="lg" variant="danger">Delete Employee</Button>
          </Form>
        </div>
        );
    }
}

export default EditEmployee