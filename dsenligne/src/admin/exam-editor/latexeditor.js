import React from 'react'
import {PropTypes} from 'prop-types'
import { Container, Row, Col, Button, Form, ButtonGroup  } from 'react-bootstrap';
import {parseLatex} from './../../main'

export default class LatexEditor extends React.Component {

    /* RERENDER OPTIMIZATIONS IN EDITORS
     *
     * ISSUE: Sending the state up at each changes makes typing laggy.
     *  - FIRST:  due to changes in state in all previous components, this one is rerendered 4 times
     *            solution: shouldComponentUpdate code.
     *  - SECOND: No way to call update out of UI thread, so small lag when calling
     *            Solution: call max. once every second.
     */

    constructor(props){
        super(props)

        this.state = {content: props.content || ""}

        // OPTIMIZATION
        this.lastRenderedContent = null;
        this.hasChanged = false;

    }

    // PREVENTS MULTIPLE RERENDERS FOR THE SAME CHANGE
    shouldComponentUpdate(nextProps, nextState){

        if(nextProps.content != this.lastRenderedContent || nextState.content != this.lastRenderedContent){
            return true;
        }

        return false;

    }

    componentDidMount(){

        // PUSH CHANGES UP ONLY ONCE A SECOND
        setInterval(() => {
            if(this.hasChanged){
                this.props.update(this.state);
                this.hasChanged = false;
            }
        }, 1000);

    }

    onChange(event){
        this.setState({content: event.target.value});
        this.hasChanged = true;
    }

    render(){

        this.lastRenderedContent = this.state.content;

        return  <div style={{margin:"1em"}}>

                    <strong>Zone LaTeX</strong><br/>

                    <Form.Label>Saisissez du LaTeX ci-dessous:</Form.Label>
                    <Form.Control as="textarea" rows={3} value={this.state.content} onChange={this.onChange.bind(this)} />

                    <Form.Label style={{marginTop:"1em"}}>Prévisualisation:</Form.Label>
                    <div style={{minHeight:"3em", width:"inherit", backgroundColor:"lightgray"}}>
                        {parseLatex(this.state.content)}
                    </div>
        
                </div>

    }

}

LatexEditor.propTypes = {
    content: PropTypes.string,
    update: PropTypes.func
}