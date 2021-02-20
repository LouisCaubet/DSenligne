/* eslint-disable react/prop-types */
import React, {Suspense} from 'react';
import { Container, Row, Col, Jumbotron, Button, Badge, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import Canvas from 'react-canvas-polygons'
import Input from './input'
import tblvariation from './tblvariation.jpg'

export default class CanvasBlock extends React.Component {

    constructor(props){
        super(props);
        this.state = {data: null};
    }

    handleCleanCanva(){
        this.canva.cleanCanvas();
    }

    updateData(data){
        // this.setState({data: data});
    }

    updateAnswer(){
        console.log("update answer for canvasblock")
        setTimeout(() => {
            console.log(this.canva.state)
            this.props.updateAnswer(this.canva.state.data);
        }, 1000);
    }

    render(){


        return  <div style={{marginBottom: "1em", marginTop: "2em"}}>
        
                    <Suspense>

                        
                        <Input render = {state =>
                        
                            <Canvas
                                ref={canva => this.canva = canva}
                                imgSrc={tblvariation}
                                height={this.props.imageInfo.height}
                                width={this.props.imageInfo.width}
                                brushSize={Number(state.brush)}
                                color={state.color}
                                tool={state.tool}
                                onDataUpdate = {this.updateData.bind(this)}
                                onFinishDraw={this.updateAnswer.bind(this)}
                                initialData={this.props.initialState}
                            />

                        }>

                        
                        </Input>

                        <div style={{clear:"both"}} />

                        <Button variant="danger" style={{ marginBottom: '20px' }}
                            onClick={this.handleCleanCanva.bind(this)}
                        >
                            Tout effacer
                        </Button>
                    
                    
                    </Suspense>
        
                </div>
            
        
    }

}