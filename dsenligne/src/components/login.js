/* eslint-disable react/prop-types */
import React from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap'
import Axios from 'axios'
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';


import {API_PATH} from '../index'

export default class Login extends React.Component {

    constructor(props){
        super(props)

        this.state = {username: "", password: "", tryagain: false, redirect: false}

        this.usernameChange = this.usernameChange.bind(this)
        this.passwordChange = this.passwordChange.bind(this)
        this.submit = this.submit.bind(this)

    }

    usernameChange(event){
        this.setState({username: event.target.value});
    }

    passwordChange(event){
        this.setState({password: event.target.value});
    }

    submit(event){

        console.log("submit called. Querying API...")
        
        const params = new URLSearchParams();
        params.append("username", this.state.username);
        params.append("password", this.state.password);

        const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }

        Axios.post(API_PATH + "/login", params, config)
            .then((result) => {

                    console.log("Query complete. Result:")
                    console.log(result)

                    if(!result.data.success){
                        this.setState({tryagain: true})
                    }
                    else {

                        window.sessionStorage.setItem('username', result.data.username)
                        window.sessionStorage.setItem('firstname', result.data.firstname)
                        window.sessionStorage.setItem('lastname', result.data.lastname)
                        window.sessionStorage.setItem('interface', result.data.interface)

                        this.setState({redirect:true})
                    }
                }
            )


        event.preventDefault();
    }

    render(){

        const errorGroup =  <div style={{color:"red", marginBottom:"20px", textAlign:"center"}}>
                                <strong>Nom d&#39;utilisateur ou mot de passe incorrect!</strong>
                            </div>

        const redirect = <Redirect to="/dashboard" />

        return  <Container fluid>

                    {this.state.redirect && redirect}

                    <div style={{
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: "100%"
                    }}>

                        <Row>
                            <Col></Col>
                            <Col>

                                {this.state.tryagain && errorGroup}

                                <Form onSubmit={this.submit}>

                                    <Form.Group controlId="formUserName">
                                        <Form.Label>Nom d&#39;utilisateur</Form.Label>
                                        <Form.Control placeholder="Saisissez votre nom d'utilisateur" 
                                            value={this.state.username} onChange={this.usernameChange} />
                                    </Form.Group>
                                
                                    <Form.Group controlId="formPassword">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control type="password" placeholder="Mot de passe" 
                                        value={this.state.password} onChange={this.passwordChange} />
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                    Connexion
                                    </Button>
                                </Form>
                            </Col>
                            <Col></Col>
                        </Row>

                    </div>

                    

                </Container>


    }

}
