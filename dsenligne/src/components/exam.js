/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Row, Col, Jumbotron, Button, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import tblvariation from './tblvariation.jpg'
import {StaticMathField} from 'react-mathquill'
import Axios from 'axios'
import {withRouter, Redirect} from 'react-router-dom'

import Question from './question'
import Timer from './timer';

import {API_PATH} from './../index'


class Exam extends React.Component {

    constructor(props){
        super(props);

        let id = this.props.match.params.id;
        
        this.state = {
            id: id, 
            title: "Loading error",
            questions: [], 
            answers: [], 
            step: 0, 
            duration: 0
        }
    }

    componentDidMount(){

        // If the exam has already been started, open save.

        Axios.get(API_PATH + "/ongoing-exam").then((res) => {

            console.log(res)

            if(res.data != ""){
                this.setState({
                    title: res.data.exam.title,
                    questions: res.data.exam.questions,
                    answers: res.data.filled.answers,
                    step: 1,
                    duration: res.data.exam.duration - ((new Date() - filled.dateStarted) / 1000)
                })
            }

        }).catch((error) => {
            if(error.response && error.response.status == 401){
                this.setState({step: -1});
            }
        });

    }

    start(){

        Axios.get(API_PATH + "/start-exam", {
            params: {
                id: this.state.id
            }
        }).then((res) => {

            this.setState({
                title: res.data.title,
                questions: res.data.questions,
                answers: [res.data.questions.length],
                step: 1,
                duration: res.data.duration
            });

        }).catch((error) => {
            this.setState({step:-1});
        });

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
        for(let q of this.state.questions){
            question_blocks.push(<Question index={i} blocks={q.blocks} updateAnswer = {this.updateAnswer.bind(this, i)} />);
            i++;
        }

        let loginRedirect = <Redirect to="/logout" />

        let alert = <PreStartAlert start={this.start.bind(this)} />

        let content = <Container fluid style={{marginTop: "1em"}}>
                        <Row>
                            <Col>
                                <Timer time={this.state.duration} />
                            </Col>
                            <Col xs={6} style={{boxShadow:"2px 2px 10px gray"}}>

                                <h1 className="exam-title">{this.state.title}</h1>

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


        return  <div>

                    {this.state.step == -1 && loginRedirect}
                    {this.state.step == 0 && alert}
                    {this.state.step == 1 && content}

                </div>

    }

}

function PreStartAlert(props){

    return  <Container fluid>

                <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "100%"
                }}>

                    <Row>
                        <Col></Col>
                        <Col>

                            <Jumbotron style={{backgroundColor:"orange"}}>
                                <h1>Vous vous apprétez à commencer le DS.</h1>
                                <p>Une fois lancé, vous ne pourrez pas mettre en pause.<br/>
                                    Assurez vous d&#39;être prêt!</p>

                                <Button variant="danger" onClick={props.start}>Commencer</Button>
                            </Jumbotron>
                            
                        </Col>
                        <Col></Col>
                    </Row>

                </div>

                

            </Container>
        
}

export default withRouter(Exam);