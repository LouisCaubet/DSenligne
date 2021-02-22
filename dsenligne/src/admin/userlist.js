import React from 'react'
import {List, Datagrid, TextField, BooleanField, ArrayField, NumberField, DateField, SingleFieldList, ChipField,
            ReferenceField, ReferenceArrayField} from 'react-admin'

export const UserList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <BooleanField source="isteacher" />
            <BooleanField source="isadmin" />
            <TextField source="groups" />
            <TextField source="examsTodo" />
            <TextField source="ongoingExam" />
            <ReferenceField source="_id" reference="s"><TextField source="id" /></ReferenceField>
            <TextField source="username" />
            <TextField source="firstname" />
            <TextField source="lastname" />
            <NumberField source="__v" />
            <TextField source="id" />
            <TextField source="displayname" />
        </Datagrid>
    </List>
);