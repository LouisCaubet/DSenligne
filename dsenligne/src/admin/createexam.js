import React from 'react'
import {Create, FormTab, required, TabbedForm, TextInput} from 'react-admin'
import { useField } from 'react-final-form';
import {TextField} from '@material-ui/core'
import {PropTypes} from 'prop-types'
import {ExamEditor} from './exam-editor/exameditor';

export default class CreateExam extends React.Component {
    

    render(){

        

        return <Create {...this.props} title="Création de DS">

                    <TabbedForm>

                        <FormTab label="Présentation">

                            <TextInput source="title" label="Titre" validate={required()} />
                            <TextInput source="description" multiline label="Description" />
                            
                            <DurationPicker name="duration" validate={required()} />
                            <DueDatePicker name="dueDate" validate={required()} />

                        
                        </FormTab>

                        <FormTab label="Contenu">

                            <ExamEditor />
                        
                        </FormTab>

                        <FormTab label="Groupes">
                        
                        </FormTab>

                    </TabbedForm>

                </Create>

    }


} 

function DurationPicker(props){

    const {
        input: { value, onChange },
        meta: { touched, error }
    } = useField(props.name);

    function convert(event){
        const v = event.target.value;
        [hours, minutes] = v.split(":");
        onChange(parseInt(hours) * 3600 + parseInt(minutes) * 60);
    }

    let defaultVal = "01:00"

    if(!value){
        // Save default value
        onChange(3600);
    }
    else {
        const hours = Math.floor(parseInt(value) / 3600);
        const minutes = Math.floor((parseInt(value) - hours * 3600) / 60)
        defaultVal = IntTo2Digits(hours) + ":" + IntTo2Digits(minutes);
    }

    return <TextField
                id="time"
                label="Durée"
                type="time"
                defaultValue="01:00"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                onChange= {convert}
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

    function IntTo2Digits(int){
        if(int<10){
            return "0" + int;
        }
        else {
            return "" + int
        }
    }

    const date = new Date();
    const datestr = date.getFullYear() + "-" + IntTo2Digits(date.getMonth()+1) + "-" 
                + IntTo2Digits(date.getDate());

    if(!value){
        onChange(date);
    }

    function convert(event){
        onChange(new Date(event.target.value));
    }

    return <TextField
                id="date"
                label="À faire pour le"
                type="date"
                defaultValue={datestr}
                InputLabelProps={{
                    shrink: true,
                }}
                style={{marginTop: "1.5em", marginBottom: "1.5em"}}
                onChange={convert}
            />

}

DueDatePicker.propTypes = {
    name: PropTypes.String
}