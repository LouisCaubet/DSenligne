/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Row, Col, Jumbotron, Button, Badge, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import {StaticMathField} from 'react-mathquill'
import QCMBlock from './qcm-block'
import EditableMathBlock from './editable-math-block';
import CanvasBlock from './canvas-block'
import {parseLatex} from './../main'

export default class Question extends React.Component {

    constructor(props){
        super(props);

        let tbl = []
        for(let i in this.props.blocks){
            tbl.push(null);
        }

        this.state = {answers: tbl}

    }

    updateAnswer(id, value){
        this.setState(state => {
            let array = state.answers;
            array[id] = value;
            return {answers: array};
        });
    }

    render(){

        let blocks = [];
        let i = 0;

        for(let block of this.props.blocks){
            
            if(block.type === "qcm"){
                blocks.push(<QCMBlock values = {block.props.values} updateAnswer =  {this.updateAnswer.bind(this, i)}/>);
            }
            else if(block.type === "math"){
                blocks.push(<EditableMathBlock height={block.props.height} latex={block.props.latex}
                    updateAnswer = {this.updateAnswer.bind(this, i)} />);
            }
            else if(block.type === "canvas"){
                blocks.push(<CanvasBlock imageInfo={block.props.imageInfo}
                    updateAnswer = {this.updateAnswer.bind(this, i)} />);
            }
            else if(block.type === "text"){
                blocks.push(<p style={{marginBottom: "1em"}}>{parseLatex(block.props.content)}</p>)
            }

            i++;

        }

        return  <div className="qcm-question">

                    <h3>{parseInt(this.props.index) + 1}. </h3>

                    {blocks}

                </div>

    }

}