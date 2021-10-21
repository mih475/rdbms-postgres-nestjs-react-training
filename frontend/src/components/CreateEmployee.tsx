import React, { Component } from 'react';
import { ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import {CreateEmployeeI} from './CreateEmployeeInterface';
import DropdownMenu from 'react-overlays/esm/DropdownMenu';
class CreateEmployee extends Component<{},CreateEmployeeI> {
    constructor(props: any) {
        super(props)

        // Setting up state
        this.state = {
          firstname: "",
          lastname: "",
          role: "",
          email: ""
        }
    
        // Setting up functions
        this.onChangeEmployeeFirstName = this.onChangeEmployeeFirstName.bind(this);
        this.onChangeEmployeeLastName = this.onChangeEmployeeLastName.bind(this);
        this.onChangeEmployeeEmail = this.onChangeEmployeeEmail.bind(this);
        this.onChangeEmployeeRole = this.onChangeEmployeeRole.bind(this);
        this.submitForm =  this.submitForm.bind(this);
      }


    
      onChangeEmployeeFirstName(e: ChangeEvent<HTMLInputElement>) {
        if(!e.target.value.match((/^[a-zA-Z]+$/))|| e.target.value.length < 3){
          this.setState({firstname: ""})
          document.getElementById("firstnameErr")!.innerHTML = "Please insert a valid first name!" + "<br />" + 
             "Can't add numbers or expressions for your first name" + "<br />" + 
             "At least three letters must exist as first name. Add another letter before changing the remaining three letters"
        }
        else {
          document.getElementById("firstnameErr")!.innerHTML = "";
          this.setState({firstname: e.target.value});
        }
      };
    
      onChangeEmployeeLastName(e: ChangeEvent<HTMLInputElement>) {
        if(!e.target.value.match((/^[a-zA-Z]+$/))|| e.target.value.length < 3){
          this.setState({lastname: ""})
          document.getElementById("lastnameErr")!.innerHTML = "Please insert a valid last name!" + "<br />" + 
             "Can't add numbers or expressions for your last name" + "<br />" + 
             "At least three letters must exist as last name. Add another letter before changing the remaining three letters"
        }
        else {
          document.getElementById("lastnameErr")!.innerHTML = "";
          this.setState({lastname: e.target.value});
        }
      }

      onChangeEmployeeRole(e: ChangeEvent<HTMLInputElement>) {
        this.setState({role: e.target.value});
      }

      onChangeEmployeeEmail(e: ChangeEvent<HTMLInputElement>) {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regEmail.test(e.target.value)) {
            this.setState({email: ""});
            document.getElementById("emailErr")!.innerHTML = "Please insert a valid email!" + "<br />" + 
             "Can't remove '@'" + "<br />" + 
             "Last element before '@' and first element after '@' must be a letter. Add another letter before changing that element" + "<br />" + 
             "Two letters must exist after the last '.'. Add another letter before changing those remaining two letters" + "<br />" + 
             "First element of email can't start with '@'. Add another letter before changing that first element";
        }
        else {
          document.getElementById("emailErr")!.innerHTML = "";
          this.setState({email: e.target.value});
        }
      }

      submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        // Preventing the page from reloading
        event.preventDefault();

        try {
          const employeeObject = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            role: this.state.role,
            email: this.state.email
          };
          axios.post('http://localhost:7000/employees/create', employeeObject)
            .then(res => {
              console.log(res.data);
              this.setState({firstname: '', lastname: '', role: '', email: ''})

              console.log(`Employee successfully created!`);
              console.log(`First Name: ${this.state.firstname}`);
              console.log(`Last Name: ${this.state.lastname}`);
              console.log(`Role: ${this.state.role}`);
              console.log(`Email: ${this.state.email}`);
              alert(`Employee successfully created!`);
              window.location.href = 'http://localhost:3000/employee-list';

            })
            .catch (err => {
              if (err.response) {
                console.log(err.response.data);
                alert(err.response.data);
                window.location.href = 'http://localhost:3000/create-employee'
              } else if (err.request) {
                
              } else {
              }
            })

        } catch (error) {
          console.log("error");
        }
    
      }

    render () {
      var isEnabled = this.state.firstname.length > 0 && this.state.lastname.length > 0 && 
                        this.state.role.length > 0 && this.state.email.length > 0;

        console.log(this.state.email.length);
        console.log(isEnabled);                  
        return (
            <div className= 'container'>
                <Form onSubmit={this.submitForm} style={{
                    width: "100%",
                    paddingLeft: "8px",
                    paddingTop: "30px",
                    paddingBottom: "6px"
                    }}>
                    <Form.Group controlId="firstname" onChange={this.onChangeEmployeeFirstName}>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Please insert a valid first name!"/>
                        <Form.Label id="firstnameErr"></Form.Label>
                    </Form.Group>

                    <br/ >
                    <Form.Group controlId="lastname" onChange={this.onChangeEmployeeLastName}>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Please insert a valid last name!"/>
                        <Form.Label id="lastnameErr"></Form.Label>
                    </Form.Group>

                    <br/ >
                    <Form.Group controlId="role" onChange={this.onChangeEmployeeRole}>
                        <Form.Label>Role</Form.Label>
                        <Form.Control type="text" placeholder="Please insert a valid role!"/>
                        <Form.Label id="roleErr"></Form.Label>
                    </Form.Group>
                    <br/ >
                    <Form.Group controlId="email" onChange={this.onChangeEmployeeEmail}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Please insert a valid email address!"/>
                        <Form.Label id="emailErr"></Form.Label>
                    </Form.Group>

                    <br/ >
                    <Button disabled={!isEnabled} variant="danger" size="lg" type="submit">
                        Create Employee
                    </Button>
                </Form>
            </div>
        )
    }
}

export default CreateEmployee