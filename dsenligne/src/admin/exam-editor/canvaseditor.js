import React from 'react'
import {PropTypes} from 'prop-types'
import { Container, Row, Col, Button, Form, ButtonGroup  } from 'react-bootstrap';


export default class CanvasEditor extends React.Component {

    constructor(props){
        super(props);

        this.state = {url: props.url}

        this.lastRenderedUrl = null;
        this.hasChanged = false;
    }

    componentDidMount(){

        setInterval(() => {
            if(this.hasChanged){
                this.props.update({imageInfo: {url: this.state.url, height: "200px", width: "400px"}});
                this.hasChanged = false;
            }
        })

    }

    shouldComponentUpdate(nextProps, nextState){

        if(nextProps.url != this.lastRenderedUrl || nextState.url != this.lastRenderedUrl){
            return true;
        }

        return false;

    }

    onChange(event){
        this.setState({url: event.target.value});
        this.hasChanged = true;
    }

    render(){

        this.lastRenderedUrl = this.state.url;

        return  <div style={{margin:"1em"}}>

                    <strong>Annotation d&#39;image</strong><br/>

                    <Form.Label>Les élèves pourront tracer des traits sur l&#39;image renseignée ci-dessous.</Form.Label>
                    <Form.Group as={Row} controlId="formURL">
                        <Form.Label column sm="2">
                        URL
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" placeholder="URL" value={this.state.url} onChange={this.onChange.bind(this)} />
                        </Col>
                    </Form.Group>
        
                </div>

    }

}

CanvasEditor.propTypes = {
    url: PropTypes.string,
    update: PropTypes.func
}