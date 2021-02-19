import React from 'react';
import { Container, Row, Col, Jumbotron, Button, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types'
import {Link, Redirect} from 'react-router-dom'

import Axios from 'axios'

import {API_PATH} from '../index'

export default class Dashboard extends React.Component {

    constructor(props){
        super(props)

        this.state = {todo: [], corrected: [], redirect: ""}
    }

    componentDidMount(){

        // Run my-exams API call
        Axios.get(API_PATH + "/myexams").then((res) => {
                this.setState({todo: res.data})
        }).catch((error) => {
            this.setState({redirect: "login"})
        });

    }

    render(){

        let jumbos = [];
        let i = 0
        for(let test of this.state.todo){
            jumbos.push(<TodoJumbo key={i} id={test._id} title={test.title} description={test.description} 
                            duration={test.duration} date={new Date(test.dueDate)} />);
            i++;
        }

        let redirectToLogin = <Redirect to="/logout" />

        return  <div>

                    {this.state.redirect == "login" && redirectToLogin}

                    <Container fluid>
                        <Row>
                            <Col className="m-5">
                                <h1 style={{marginBottom:"0.5em"}}>À faire <Badge variant="danger">{jumbos.length}</Badge></h1>
                                {jumbos}
                            </Col>
                            <Col className="m-5">
                                <h1 style={{marginBottom:"0.5em"}}>Corrigés disponibles <Badge variant="success">1</Badge></h1>
                                <DoneJumbo />
                            </Col>
                        </Row>
                    </Container>
        
                </div>
    }

}

function TodoJumbo(props){


    return  <Jumbotron>
                <h1>{props.title}</h1>
                <p>
                    {props.description} <br />
                    Durée : {Math.floor(props.duration / 60)} min {props.duration % 60 != 0 && props.duration % 60 + "s"}<br />
                    Pour le: {IntTo2Digits(props.date.getDate()) + "/" + IntTo2Digits(props.date.getMonth()+1) + 
                                "/" + props.date.getFullYear()}
                </p>
                <p>
                    <Link to={"/exam/" + props.id}>
                        <Button variant="primary">Commencer le test</Button>
                    </Link>
                </p>
            </Jumbotron>

}

function IntTo2Digits(int){
    if(int<10){
        return "0" + int;
    }
    else {
        return "" + int
    }
}

TodoJumbo.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    duration: PropTypes.number,
    date: PropTypes.any
}


function DoneJumbo(props){

    return  <Jumbotron>
                <h1>Test de fiche semaine 1</h1>
                <p>
                    Chapitres : fonction exponentielle, ... <br />
                    <span style={{color:"green"}}>9/10</span>
                </p>
                <p>
                    <Button variant="success">Voir le corrigé</Button>
                </p>
            </Jumbotron>

}