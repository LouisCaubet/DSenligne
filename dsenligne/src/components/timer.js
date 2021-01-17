/* eslint-disable react/prop-types */
import React from 'react';
import {Button, NavbarBrand} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Timer extends React.Component {

    constructor(props){
        super(props)

        this.state = {min: Math.floor(this.props.time / 60), s: this.props.time % 60}

    }

    componentDidMount(){
        this.timerID = setInterval(
            () => this.tick(),
            1000
          );
    }

    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    tick(){
        this.setState(state => {
            if(state.s != 0){
                return {s: state.s - 1}
            }
            else if(state.min != 0){
                return {min: state.min - 1, s: 59}
            }
            else {
                // callback
                clearInterval(this.timerID);
            }
        })
    }

    intToText(nb){
        if(nb<10){
            return "0" + nb;
        }
        else {
            return "" + nb;
        }
    }


    render(){

        return  <div>
                    <Button variant={this.state.min > 0 ? "success" : "warning"} block disabled={true}>{this.intToText(this.state.min)}:{this.intToText(this.state.s)}</Button>
                </div>

    }

}