import React from 'react'
import {PropTypes} from 'prop-types'
import QCMEditor from './qcmeditor'
import LatexEditor from './latexeditor'
import MathAreaEditor from './mathareaeditor';
import CanvasEditor from './canvaseditor';

import { Container, Row, Col, Form, ButtonGroup, Button  } from 'react-bootstrap';
import AddIcon from '@material-ui/icons/Add'
import {withStyles} from '@material-ui/core/styles'
import {Menu, MenuItem, ListItemIcon, ListItemText} from '@material-ui/core'

import Latex from "./latex.svg"
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FunctionsIcon from '@material-ui/icons/Functions';
import CreateIcon from '@material-ui/icons/Create';


export default class QuestionEditor extends React.Component {

    constructor(props){
        super(props)

        this.state = {blocks: this.props.blocks}
    }

    update(index, value){
        let prev = this.state.blocks;
        prev[index].props = value;
        this.setState({blocks: prev}, () => {
            this.props.update(this.state.blocks)
        });
    }

    addAfter(index, obj){
        this.setState({
                blocks: [...this.state.blocks.slice(0, index), obj, ...this.state.blocks.slice(index)],
            },
            () => this.props.update(this.state.blocks));
    }

    render(){

        let blocks = [];
        let i = 0;

        blocks.push(<AddButton key={-1} onClick={this.addAfter.bind(this, 0)} />)

        for(let block of this.state.blocks){

            let editor = null;
            
            if(block.type === "qcm"){
                editor = <QCMEditor values={block.props.values} update={this.update.bind(this, i)} />;
            }
            else if(block.type === "math"){
                editor = <MathAreaEditor height={block.props.height} />;
            }
            else if(block.type === "canvas"){
                editor = <CanvasEditor url={block.props.imageInfo.url} update={this.update.bind(this, i)} />;
            }
            else if(block.type === "text"){
                editor = <LatexEditor content={block.props.content} update={this.update.bind(this, i)}/>
            }

            blocks.push(<div key={i}>
                            {editor}
                            <AddButton onClick={this.addAfter.bind(this, parseInt(i) + 1)}/>
                        </div>)

            i++;

        }

        return  <Container fluid>

                    {blocks}
            
                </Container>

    }

}

QuestionEditor.propTypes = {
    blocks: PropTypes.array,
    update: PropTypes.func
}

function AddButton(props){

    const StyledMenu = withStyles({
        paper: {
          border: '1px solid #d3d4d5',
        },
      })((props) => (
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          {...props}
        />
      ));

    const [anchorEl, setAnchorEl] = React.useState(null);

    function openMenu(event){
        setAnchorEl(event.currentTarget);
    }

    function closeMenu(){
        setAnchorEl(null);
    }

    function addLatexField(){
        props.onClick({
            type: "text",
            props: {
                content: ""
            }
        });
        closeMenu();
    }

    function addQCM(){
        props.onClick({
            type: "qcm",
            props: {
                values: []
            }
        });
        closeMenu();
    }

    function addMathLine(){
        props.onClick({
            type: "math",
            props:{
                height: "4em",
                latex: ""
            }
        });
        closeMenu();
    }

    function addCanvas(){
        props.onClick({
            type: "canvas",
            props: {
                imageInfo: {
                    url: "",
                    height: "200px",
                    width: "400px"
                }
            }
        });
        closeMenu();
    }

    return  <div style={{width: "100%"}}>

                <Button id="button" variant="light" block onClick={openMenu}>
                    <AddIcon />
                </Button>

                <StyledMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>

                    <MenuItem onClick={addLatexField}>
                        <ListItemIcon>
                            <img src={Latex} width="30px"/>
                        </ListItemIcon>
                        <ListItemText primary="Zone LaTeX" />
                    </MenuItem>

                    <MenuItem onClick={addQCM}>
                        <ListItemIcon>
                            <FormatListBulletedIcon />
                        </ListItemIcon>
                        <ListItemText primary="QCM" />
                    </MenuItem>

                    <MenuItem onClick={addMathLine}>
                        <ListItemIcon>
                            <FunctionsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Ligne de réponse maths" />
                    </MenuItem>

                    <MenuItem onClick={addCanvas}>
                        <ListItemIcon>
                            <CreateIcon />
                        </ListItemIcon>
                        <ListItemText primary="Annotation d'images" />
                    </MenuItem>
                
                </StyledMenu>
    
            </div>

}

AddButton.propTypes = {
    onClick: PropTypes.func
}