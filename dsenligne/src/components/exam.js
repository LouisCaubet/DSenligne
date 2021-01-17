/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Row, Col, Jumbotron, Button, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import tblvariation from './tblvariation.jpg'
import {StaticMathField} from 'react-mathquill'

import Question from './question'
import Timer from './timer';

export default class Exam extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {answers: [this.props.questions.length]}
    }

    updateAnswer(id, value){
        this.setState( state => {
            let arr = state.answers;
            arr[id] = value;
            return {answers: arr};
        });
    }

    render(){

        let question_blocks = []
        let i = 0;
        for(let q of this.props.questions){
            question_blocks.push(<Question index={i} blocks={q.blocks} updateAnswer = {this.updateAnswer.bind(this, i)} />);
            i++;
        }

        return  <div>

                    <Container fluid style={{marginTop: "1em"}}>
                        <Row>
                            <Col>
                                <Timer time={600} />
                            </Col>
                            <Col xs={6} style={{boxShadow:"2px 2px 10px gray"}}>

                                <h1 className="exam-title">{this.props.title}</h1>

                                {question_blocks}
                   
                                <div className="text-center" style={{margin:"1em"}}>
                                    <Button variant="success">Terminer</Button>
                                </div>
                                          
                            </Col>
                            <Col>
                                <Button variant="danger" block>Quitter</Button>
                            </Col>
                        </Row>
                    </Container>
                    
                </div>

    }

}