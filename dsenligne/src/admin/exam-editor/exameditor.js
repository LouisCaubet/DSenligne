import React from 'react'
import { useField } from 'react-final-form';
import {PropTypes} from 'prop-types'
import QuestionEditor from './questioneditor'

import { Container, Row, Col, Form, ButtonGroup, Button  } from 'react-bootstrap';

import {Accordion, AccordionSummary,AccordionDetails} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/DeleteOutline'

class ExamEditorBase extends React.Component {

    constructor(props){
        super(props)

        let uuids = []
        for(let i in props.value){
            uuids.push(i);
        }

        if(!props.value){
            uuids = [0]
        }

        this.state = {questions: props.value && props.value.length > 0 ? props.value : [{blocks: []}],
                      uuids: uuids, 
                      nextUUID: props.value ? props.value.length : 1}

    }

    addQuestionAfter(index){

        this.setState({
                questions: [...this.state.questions.slice(0, index), {blocks: []}, ...this.state.questions.slice(index)],
                uuids: [...this.state.uuids.slice(0, index), this.state.nextUUID, ...this.state.uuids.slice(index)],
                nextUUID: this.state.nextUUID + 1
            }, () => this.pushChangesToReactAdmin());
    }

    removeQuestion(index){
        this.setState({
                questions: [...this.state.questions.slice(0, index), ...this.state.questions.slice(parseInt(index)+1)],
                uuids: [...this.state.uuids.slice(0, index), ...this.state.uuids.slice(parseInt(index) + 1)]
            }, () => this.pushChangesToReactAdmin());
    }

    update(index, value){

        let prev = [...this.state.questions];
        prev[index] = {blocks: value};
        this.setState({questions: prev}, () => {
            this.pushChangesToReactAdmin();
        });
        
    }

    pushChangesToReactAdmin(){
        this.props.onChange(this.state.questions)
    }

    render(){

        let question_blocks = []
        for(let i in this.state.questions){

            question_blocks.push(   <QuestionRow key={this.state.uuids[i]} id={i} canRemove={this.state.questions.length > 1}
                                                addAfter={this.addQuestionAfter.bind(this, parseInt(i)+1)}
                                                remove={this.removeQuestion.bind(this, i)}>

                                        <QuestionEditor blocks={this.state.questions[i].blocks}
                                                        update={this.update.bind(this, i)} />

                                    </QuestionRow>
                                );
        }

        return  <Container fluid>

                    {question_blocks}

                </Container>

    }

}

ExamEditorBase.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func
}

export const ExamEditor = props => {

    const {
        input: { value, onChange },
        meta: { touched, error }
    } = useField("questions");

    return <ExamEditorBase value={value}  onChange={onChange} />

}


function QuestionRow(props){

    return  <Row>

                <Col>
                    <Accordion>
                    
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <strong>{"Question " + (parseInt(props.id)+1)}</strong>
                        </AccordionSummary>

                        <AccordionDetails>
                            {props.children}
                        </AccordionDetails>
                    
                    </Accordion>
                </Col>

                <Col xs="auto">
                    <Button variant="outline-success" onClick={props.addAfter} 
                        style={{float:"left", margin:"0.5em"}}>
                        <AddIcon />
                    </Button>
                    <Button variant="outline-danger" onClick={props.remove} disabled={!props.canRemove}
                        style={{float:"left", margin:"0.5em"}}>
                        <DeleteIcon />
                    </Button>
                </Col>
    
            </Row>

}

QuestionRow.propTypes = {
    id: PropTypes.number,
    children: PropTypes.any,
    addAfter: PropTypes.func,
    remove: PropTypes.func,
    canRemove: PropTypes.bool
}