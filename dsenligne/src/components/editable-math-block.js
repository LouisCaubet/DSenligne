/* eslint-disable react/prop-types */
import React from 'react';
import { Container, Row, Col, Jumbotron, Button, Badge, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import {EditableMathField} from 'react-mathquill'


export default class EditableMathBlock extends React.Component {

    render(){

        return  <div style={{marginBottom: "1em"}}>

                    <EditableMathField latex={this.props.latex ? this.props.latex : ""} 
                    style={{height: this.props.height, width:"100%"}}
                    onChange={(target) => {
                        this.props.updateAnswer(target.latex());
                    }} />
        
                </div>
        
    }

}