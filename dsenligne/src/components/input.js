/* eslint-disable react/prop-types */
import React from 'react';
import {Button, ButtonGroup} from 'react-bootstrap'

export default class Input extends React.PureComponent {

    constructor(props){

        super(props);
        this.state = {
            brush: 2,
            color: '#000000'
        }

        this.handleChange = (event) => {
            const { value, name } = event.target;
            const newValue = { [name]: value };
            this.setState({ ...newValue })
        }
    
        this.handleButtonClick = (event) => {
            event.stopPropagation();
            const { name } = event.target;
            this.setState({ tool: name });
        };
        
    }


    render() {
        return(
            <React.Fragment>
                <div>
                    <input type="range" min="1" max="20" value={this.state.brush}
                        name="brush" className="slider" onChange={this.handleChange} />
                    <span> Taille: {this.state.brush}</span>
                </div>
                <div>
                    <input type="color" name="color"
                        value={this.state.color} onChange={this.handleChange}/>
                    <label htmlFor="color"> Couleur </label>
                </div>
                <div onClick={this.handleButtonClick}>
                    <ButtonGroup>
                    
                        <Button name="Line" variant="secondary">
                            Ligne
                        </Button>
                        <Button name="Polygon" variant="secondary">
                            Polygone
                        </Button>

                    </ButtonGroup>
                    
                </div>
                {this.props.render(this.state)}
            </React.Fragment>
        );
    }
}