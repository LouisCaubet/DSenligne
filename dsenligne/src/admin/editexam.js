/* eslint-disable react/prop-types */
import React from 'react'
import {Edit, FormTab, required, TabbedForm, TextInput} from 'react-admin'
import { useField } from 'react-final-form';
import {TextField} from '@material-ui/core'
import {PropTypes} from 'prop-types'
import {ExamEditor} from './exam-editor/exameditor';

export default class EditExam extends React.Component {

    onTimePickerChange(date){
        const seconds = date.getHours() * 3600 + date.getMinutes() * 60;
    }

    

    render(){

        

        return <Edit {...this.props} title="Edition de DS">

                    <TabbedForm>

                        <FormTab label="Présentation">

                            <TextInput source="title" label="Titre" />
                            <TextInput source="description" multiline label="Description" />
                            
                            <DurationPicker name="duration" />
                            <DueDatePicker name="dueDate" />

                        
                        </FormTab>

                        <FormTab label="Contenu">

                            <ExamEditor />
                        
                        </FormTab>

                        <FormTab label="Groupes">
                        
                        </FormTab>

                    </TabbedForm>

                </Edit>

    }


} 

function DurationPicker(props){

    const {
        input: { value, onChange },
        meta: { touched, error }
    } = useField(props.name);

    const hours = Math.floor(parseInt(value) / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    let defValue = IntTo2Digits(hours) + ":" + IntTo2Digits(minutes);

    console.log(defValue);

    if(value == 0) defValue = "01:00";
    

    return <TextField
                id="time"
                label="Durée"
                type="time"
                defaultValue={defValue}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                onChange= {onChange}
            />

}

DurationPicker.propTypes = {
    name: PropTypes.String
}

function DueDatePicker(props){
    
    const {
        input: { value, onChange },
        meta: { touched, error }
    } = useField(props.name);


    const date = value ? new Date(value) : new Date();
    const datestr = date.getFullYear() + "-" + IntTo2Digits(date.getMonth()+1) + "-" 
                + IntTo2Digits(date.getDate());

    return <TextField
                id="date"
                label="À faire pour le"
                type="date"
                defaultValue={datestr}
                InputLabelProps={{
                    shrink: true,
                }}
                style={{marginTop: "1.5em", marginBottom: "1.5em"}}
                onChange={onChange}
            />

}

DueDatePicker.propTypes = {
    name: PropTypes.String
}

function IntTo2Digits(int){
    if(int<10){
        return "0" + int;
    }
    else {
        return "" + int
    }
}