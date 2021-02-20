/* eslint-disable react/prop-types */
import React from 'react';
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import {parseLatex} from "./../main"

export default class QCMBlock extends React.Component {

    constructor(props){
        super(props);

        if(props.initialState){
            this.state = {checked: props.initialState}
        }
        else {
            let falses = []

            for(let i in this.props.values){
                falses.push(false);
            }

            this.state = {checked: falses};
        }

        

    }

    updateChecked(id, event){

        let checkedCp = [...this.state.checked];
        checkedCp[id] = !checkedCp[id];

        this.setState({checked: checkedCp}, () => {
            console.log(checkedCp);
            this.props.updateAnswer(this.state.checked);
        });

    }

    render(){

        let checks = []

        for(let i in this.props.values){
            checks.push(<Form.Check type='checkbox' key={i} id={i} label={parseLatex(this.props.values[i])} 
                checked={this.state.checked[i]} onChange={this.updateChecked.bind(this, i)} />)
        }

        return  <Form style={{marginBottom: "1em"}}>
                    {checks}
                </Form>


    }

}