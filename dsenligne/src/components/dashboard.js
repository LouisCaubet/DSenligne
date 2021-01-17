import React from 'react';
import { Container, Row, Col, Jumbotron, Button, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Dashboard extends React.Component {

    render(){
        return  <div>

                    <Container fluid>
                        <Row>
                            <Col className="m-5">
                                <h1 style={{marginBottom:"0.5em"}}>À faire <Badge variant="danger">5</Badge></h1>
                                <TodoJumbo />
                                <TodoJumbo />
                                <TodoJumbo />
                                <TodoJumbo />
                                <TodoJumbo />
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
                <h1>Test de fiche semaine 1</h1>
                <p>
                    Chapitres : fonction exponentielle, ... <br />
                    Durée : 10 min <br />
                    Pour le: 18/01/2021
                </p>
                <p>
                    <Button variant="primary">Commencer le test</Button>
                </p>
            </Jumbotron>

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