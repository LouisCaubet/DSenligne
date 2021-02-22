import React from 'react';
import PropTypes from 'prop-types'
import { Admin, ListGuesser, Resource } from 'react-admin';
import DataProvider from './dataprovider'
import { ExamList } from './examlist';
import { UserList } from './userlist';
import ShowExam from './previewexam';
import CreateExam from './createexam'
import EditExam from './editexam'

import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Person';

export default class AdminPage extends React.Component {

    render(){

        return  <Admin dataProvider={DataProvider}>

                    <Resource name="exam" list={ExamList} show={ShowExam} create={CreateExam} edit={EditExam} icon={PostIcon} />
                    <Resource name="user" list={UserList} icon={UserIcon} />
        
                </Admin>

    }

}