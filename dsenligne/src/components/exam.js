/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Row, Col, Jumbotron, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import tblvariation from './tblvariation.jpg'
import {StaticMathField} from 'react-mathquill'
import Axios from 'axios'
import {withRouter, Redirect, Link} from 'react-router-dom'
import {Popup} from 'reactjs-popup'

import Question from './question'
import Timer from './timer';

import {API_PATH} from './../index'

/* EXAM STEPS : 
 * -2 : Loading
 * -1 : Not logged in. Redirect to login
 * 0 : Pre-exam warning
 * 1 : Exam ongoing
 * 2 : Exam done
 */


class Exam extends React.Component {

    constructor(props){
        super(props);

        let id = this.props.match.params.id;
        
        this.state = {
            id: id, 
            title: "Loading error",
            questions: [], 
            answers: [], 
            step: -2, 
            duration: 0,
            saveError: false,
            saveErrorMsg: "",
            initialState: null,
            confirmLeave: false,
        }

        this.searchOngoingExam();

    }

    searchOngoingExam(){

        // If the exam has already been started, open save.

        Axios.get(API_PATH + "/ongoing-exam").then((res) => {

            console.log(res)

            if(res.data != ""){
                console.log("Found ongoing exam");

                this.setState({
                    initialState: res.data.filled.answers,
                    title: res.data.exam.title,
                    questions: res.data.exam.questions,
                    answers: res.data.filled.answers,
                    step: 1,
                    duration: Math.round(res.data.exam.duration - ((new Date().getTime() - new Date(res.data.filled.dateStarted).getTime()) / 1000)),
                });

            }
            else {
                this.setState({step: 0})
            }

        }).catch((error) => {
            console.log("error!");
            console.log(error);
            if(error.response && error.response.status == 401){
                this.setState({step: -1});
            }
        });

    }

    start(){

        this.setState({step: -2});

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
        let ansCp = [...this.state.answers]
        ansCp[id] = value
        this.setState({answers: ansCp});
    }

    sendAnswers(done){

        let body = {
            examId: this.state.id,
            done: done,
            answers: this.state.answers
        };

        console.log(body)

        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
        }

        if(done){
            this.setState({step: 2});
        }

        Axios.post(API_PATH + "/send-answers", body, config)
            .catch((err) => {
                this.setState({step: 2, saveError: true, saveErrorMsg: "Le temps est écoulé!"});
            });

    }

    closePopup(){
        this.setState({saveError: false, confirmLeave: false});
    }

    openConfirmLeavePopup(){
        this.setState({confirmLeave: true});
    }


    render(){

        let question_blocks = []
        let i = 0;
        for(let q of this.state.questions){

            question_blocks.push(<Question index={i} blocks={q.blocks} updateAnswer = {this.updateAnswer.bind(this, i)} 
                    initialState={this.state.initialState ? this.state.initialState[i] : null} />);
            
            i++;
        }

        let loadingSpinner = <div style={{
                                    position: 'absolute', left: '50%', top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    overflow:"hidden"
                                }}>

                                    <Row>
                                        <Col></Col>
                                        <Col>
                                            <Spinner animation="border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </Spinner>
                                        </Col>
                                        <Col></Col>
                                    </Row>

                                </div>

        let loginRedirect = <Redirect to="/logout" />

        let alert = <PreStartAlert start={this.start.bind(this)} />

        let content = <Container fluid style={{marginTop: "1em"}}>
                        <Row>
                            <Col>
                                <Timer time={this.state.duration} minuteCallback={this.sendAnswers.bind(this, false)}
                                    finalCallback={this.sendAnswers.bind(this, true)} />
                            </Col>
                            <Col xs={6} style={{boxShadow:"2px 2px 10px gray"}}>

                                <h1 className="exam-title">{this.state.title}</h1>

                                {question_blocks}
                   
                                <div className="text-center" style={{margin:"1em"}}>
                                    <Button variant="success" onClick={this.openConfirmLeavePopup.bind(this)}>Terminer</Button>
                                </div>
                                          
                            </Col>
                            <Col>
                                <Button variant="danger" block className="position-fixed" style={{width:"23%"}}
                                        onClick={this.openConfirmLeavePopup.bind(this)}>
                                    Quitter
                                </Button>
                            </Col>
                        </Row>
                    </Container>


        return  <div style={{marginTop: this.props.marginTop + 20}}>

                    <Popup open={this.state.saveError} onClose={this.closePopup.bind(this)}>
                        <Jumbotron style={{backgroundColor:"orange", boxShadow:"2px 2px 10px red"}}>
                            <div>Echec de l&#39;enregistrement. {this.state.saveErrorMsg}</div>
                            <Button variant="secondary" onClick={this.closePopup.bind(this)}>Fermer</Button>
                        </Jumbotron>
                    </Popup>

                    <Popup open={this.state.confirmLeave} onClose={this.closePopup.bind(this)}>
                        <Jumbotron style={{backgroundColor:"#90abb0", boxShadow:"2px 2px 10px #90abb0", paddingBottom:"0.3em", paddingTop: "0.7em"}}>
                            <h1>Avez-vous vraiment terminé?</h1>
                            <p>Une fois validé, vous ne pourrez pas reprendre!</p>
                            <p><ButtonGroup style={{width: "100%", alignContent: "center"}}>
                                <Button variant="primary" onClick={this.sendAnswers.bind(this, true)}>Oui, terminer</Button>
                                <Button variant="secondary" onClick={this.closePopup.bind(this)}>Non, continuer</Button>
                            </ButtonGroup></p>
                        </Jumbotron>
                    </Popup>

                    {this.state.step == -2 && loadingSpinner}
                    {this.state.step == -1 && loginRedirect}
                    {this.state.step == 0 && alert}
                    {this.state.step == 1 && content}
                    {this.state.step == 2 && <CompleteMessage />}

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

function CompleteMessage(props){

    return  <Container fluid>

                <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: "100%"
                }}>

                    <Row>
                        <Col></Col>
                        <Col>

                            <Jumbotron style={{backgroundColor:"green"}}>
                                <h1>Fin du test !</h1>
                                <p>Les réponses ont été envoyées.</p>

                                <Link to="/dashboard">
                                    <Button variant="dark">Retour au tableau de bord</Button>
                                </Link>
                                
                            </Jumbotron>
                            
                        </Col>
                        <Col></Col>
                    </Row>

                </div>

                

            </Container>

}

export default withRouter(Exam);