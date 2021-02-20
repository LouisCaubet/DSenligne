import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/dashboard';
import Exam from './components/exam'
import Login from './components/login'
import {StaticMathField} from 'react-mathquill'
import tblvariation from './components/tblvariation.jpg'
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import Axios from 'axios'

import {API_PATH} from './index'


export default class Main extends React.Component {

    constructor(){
        super();

        this.state = {navbarHeight: 0, redirect: null}

        // Query ongoing exam
        Axios.get(API_PATH + "/ongoing-exam").then((res) => {

            if(res.data != ""){
                console.log("Found ongoing exam");

                this.setState({
                    redirect: <Redirect to={"/exam/" + res.data.exam._id} />
                });

            }

        }).catch((error) => {
            if(error.response && error.response.status == 401){
                this.setState({redirect: <Redirect to="/logout" />});
            }
        });

        
    }

    componentDidMount(){
        let height = document.getElementById('navbar').clientHeight;
        this.setState({navbarHeight: height})
    }


    render(){

        let pageContent = <Exam 
        title = "Test de fiche semaine 1"
        questions = {[
            {blocks:
            [
                {type: 'text', props: {content: "Quelle est la valeur de $x$?"}},
                {type: 'qcm', props: {values: ["$a$", "$y$"]}},
                {type: 'math', props: {height: "4em", latex: ""}},
                {type: 'canvas', props: {imageInfo: {height: "200px", width: "500px", url: tblvariation}}}
            ]
            }]}
        />

        return  <Router>

                    {this.state.redirect}
                    <Redirect to={window.sessionStorage.getItem('username') == "" ? "/login": "/dashboard"} />

                    <Switch>
                        <Route path="/login">
                            <AppNavBar />
                            <Login />
                        </Route>
                        <Route path="/dashboard">
                            <AppNavBar />
                            <Dashboard marginTop={this.state.navbarHeight} />
                        </Route>
                        <Route path="/logout">
                            <Logout />
                        </Route>
                        <Route path="/exam/:id">
                            <AppNavBar />
                            <Exam marginTop={this.state.navbarHeight} />
                        </Route>
                    </Switch>
        
                </Router>

    }

}

function Logout(props){
    window.sessionStorage.setItem('username', "")
    window.sessionStorage.setItem('firstname', "")
    window.sessionStorage.setItem('lastname', "")
    window.sessionStorage.setItem('interface', "")
    return <Redirect to="/login" />
}

function AppNavBar(props){

    let storage = window.sessionStorage

    let connected = storage.getItem('firstname') != "";
    let name = storage.getItem('firstname') + " " + storage.getItem('lastname')

    let loggedInJSX = <span>Connecté en tant que: <a href="/account">{name}</a></span>
    let logInJSX = <a href="/login">Se connecter</a>

    let dashboardJSX =  <Nav className="mr-auto">
                            <Nav.Link href="/dashboard">Tableau de bord</Nav.Link>
                        </Nav>

    return  <Navbar bg="dark" variant="dark" fixed="top" id="navbar">

                <Navbar.Brand href="/">DS en ligne</Navbar.Brand> 

                {connected && storage.getItem('interface') == "student" && dashboardJSX}

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        {connected ? loggedInJSX : logInJSX}
                    </Navbar.Text>
                </Navbar.Collapse>

            </Navbar>

}

export function parseLatex(text){

    let isLatex = text.charAt(0) == "$";

    text = text.replace("\\$", "*****ß"); // SPECIAL STRING

    let parts = text.split("$");

    let jsx_parts = []

    for(let p of parts){

        if(p === "") continue;

        p.replace("*****ß", "$");

        if(isLatex){
            jsx_parts.push(<StaticMathField>{p}</StaticMathField>);
        }
        else jsx_parts.push(<span>{p}</span>);

        isLatex = !isLatex;
    }

    return <span>{jsx_parts}</span>

}