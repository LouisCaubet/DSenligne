import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/dashboard';
import Exam from './components/exam'
import {StaticMathField} from 'react-mathquill'
import tblvariation from './components/tblvariation.jpg'

export default class Main extends React.Component {

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

        return  <div>

                    <AppNavBar />
                    {pageContent}
        
                </div>

    }

}

function AppNavBar(props){

    return  <Navbar bg="dark" variant="dark">

                <Navbar.Brand href="#home">DS en ligne</Navbar.Brand> 

                <Nav className="mr-auto">
                    <Nav.Link href="#home">Tableau de bord</Nav.Link>
                </Nav>

                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Connecté en tant que: <a href="#login">Louis Caubet</a>
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