/* eslint-disable react/prop-types */
import React from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import {parseLatex} from "./../main"

export default class QCMBlock extends React.Component {

    constructor(props){
        super(props);

        let falses = []

        for(let i in this.props.values){
            falses.push(false);
        }

        this.state = {checked: falses};

    }

    updateChecked(id){

        this.setState(function(state){
            let checked = state.checked;
            checked[id] = !checked[id];
            return {checked: checked};
        });

        this.props.updateAnswer(this.state.checked);

    }

    render(){

        let checks = []

        for(let i in this.props.values){
            checks.push(<Form.Check type='checkbox' id={i} label={parseLatex(this.props.values[i])} onClick={this.updateChecked.bind(this, i)}/>)
        }

        return  <Form style={{marginBottom: "1em"}}>
                    {checks}
                </Form>


    }

}