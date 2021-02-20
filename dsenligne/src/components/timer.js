/* eslint-disable react/prop-types */
import React from 'react';
import {Button, NavbarBrand, Container} from 'react-bootstrap'
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
                this.props.minuteCallback();
                return {min: state.min - 1, s: 59}
            }
            else {
                this.props.finalCallback();
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

        return  <div style={{width:"23%"}}>
                    <Button variant={this.state.min > 0 ? "success" : "warning"} block disabled={true}
                            style={{position: "fixed", width: "inherit"}} >
                        {this.intToText(this.state.min)}:{this.intToText(this.state.s)}
                    </Button>
                </div>

    }

}