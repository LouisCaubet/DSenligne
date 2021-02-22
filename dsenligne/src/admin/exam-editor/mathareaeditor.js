import React from 'react'
import {PropTypes} from 'prop-types'
import { Container, Row, Col, Button, Form, ButtonGroup  } from 'react-bootstrap';
import { StaticMathField } from 'react-mathquill';


export default class MathAreaEditor extends React.Component {

    render(){

        return  <div style={{margin:"1em"}}>

                    <strong>Zone de réponse maths</strong><br/>

                    <Form.Label>L&#39;élève pourra taper des maths dans cette case:</Form.Label>
                    <StaticMathField latex="" style={{height: this.props.height, width:"100%", backgroundColor:"lightgreen"}} />

                </div>

    }

}

MathAreaEditor.propTypes = {
    height: PropTypes.any
}