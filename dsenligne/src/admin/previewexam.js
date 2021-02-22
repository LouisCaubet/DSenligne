/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Row, Col, Jumbotron, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'

import Question from '../components/question'

import {Show} from 'react-admin'


class PreviewExam extends React.Component {

    constructor(props){
        super(props);

    }

    updateAnswer(id, value){

    }



    render(){

        let question_blocks = []
        let i = 0;
        for(let q of this.props.record.questions){

            question_blocks.push(<Question index={i} blocks={q.blocks} updateAnswer = {this.updateAnswer.bind(this, i)} />);
            
            i++;
        }



        return  <Container fluid>
                    <Row>
                        <Col>
                        </Col>
                        <Col xs={8} style={{boxShadow:"2px 2px 10px gray"}}>

                            <h1 className="exam-title">{this.props.record.title}</h1>

                            {question_blocks}

                                    
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>

    }

}

export default function ShowExam(props) {

    return  <Show title="Prévisualisation du DS" {...props} >
                <PreviewExam record={props.record}/>
            </Show>

}

