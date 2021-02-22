import React from 'react'
import {PropTypes} from 'prop-types'
import { Container, Row, Col, Button, Form, ButtonGroup  } from 'react-bootstrap';

export default class QCMEditor extends React.Component {

    constructor(props){
        super(props)

        if(!this.props.values || this.props.values.length == 0){
            this.state = {values: ["", "", ""]}
        }
        else {
            this.state = {values: this.props.values}
        }

        this.lastRenderedValues = null;
        this.hasChanged = false;

    }

    componentDidMount(){

        setInterval(() => {
            if(this.hasChanged){
                this.props.update(this.state)
                this.hasChanged = false;
            }
        }, 1000);

    }

    shouldComponentUpdate(nextProps, nextState){

        if(nextProps.values != this.lastRenderedValues || nextState.values != this.lastRenderedValues){
            return true;
        }

        return false;

    }

    onRowChange(index, event){
        const prev = [...this.state.values];
        prev[index] = event.target.value;
        this.setState({values: prev});
        this.hasChanged = true;
    }

    addRowAfter(index){
        this.setState({values: [...this.state.values.slice(0, index), "", ...this.state.values.slice(index)]},
            () => {
                setTimeout(() => {
                    this.props.update(this.state)
                }, 10)
            });
    }

    removeRow(index){
        this.setState({values: [...this.state.values.slice(0, index), ...this.state.values.slice(parseInt(index)+1)]},
            () => {
                setTimeout(() => {
                    this.props.update(this.state)
                }, 10)
            });
    }

    render(){

        this.lastRenderedValues = this.state.values;

        let rows = []
        for(let i in this.state.values){
            rows.push(<QCMRow value={this.state.values[i]}  
                              onChange={this.onRowChange.bind(this, i)}
                              key={i}
                              id={parseInt(i)+1}
                              addAfter={this.addRowAfter.bind(this, parseInt(i)+1)}
                              canRemove={i != 0}
                              remove={this.removeRow.bind(this, i)}
                      />)
        }

        return <Container fluid>

                    <Row>

                        <Col xs={6}>
                            <strong>QCM</strong><br/>
                            Vous pouvez taper du LaTeX dans les options. <br/>
                        </Col>
                    
                    </Row>

                    {rows}
        
        
               </Container>

    }

}

QCMEditor.propTypes = {
    values: PropTypes.array,
    update: PropTypes.func
}

function QCMRow(props){

    return  <Row style={{marginTop: "1em", marginBottom:"1em", marginRight:"1em"}}>

                <Col xs={10} md={8}>
                    <Form.Control type="text" value={props.value} onChange={props.onChange} placeholder={"Option " + props.id} />
                </Col>

                <Col xs={2}>
                    <ButtonGroup>
                        <Button variant="success" onClick={props.addAfter} style={{marginRight:"0.5em"}}>+</Button>
                        {props.canRemove && <Button variant="danger" onClick={props.remove}>-</Button>}
                    </ButtonGroup>
                    
                </Col>
    
            </Row>

}

QCMRow.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    id: PropTypes.number,
    addAfter: PropTypes.func,
    remove: PropTypes.func,
    canRemove: PropTypes.bool
}
