/* eslint-disable react/prop-types */
import React from 'react'
import {List, 
        Datagrid, 
        TextField, 
        BooleanField, 
        DateField, 
        SingleFieldList, 
        ChipField,
        ReferenceField, 
        ReferenceArrayField,
        useListContext, 
        TopToolbar,
        CreateButton,
        ExportButton,
        EditButton,
        ShowButton,
        Button,
        sanitizeListRestProps,
      } from 'react-admin'


export const ExamList = props => (
    <List {...props} actions={<ListActions />} >
        <Datagrid rowClick="show">

            <TextField source="title" label="Titre" />
            <TextField source="description" />
            <DurationField source="duration" label="Durée" />
            <BooleanField source="isPublished" label="Publié" />
            <DateField source="dueDate" label="Pour le" />

            <ReferenceField source="owner" reference="user" label="Propriétaire">
                <TextField source="displayname" />
            </ReferenceField>

            <ReferenceArrayField source="targetGroups" reference="group" label="Groupes ciblés">
                <SingleFieldList>
                    <ChipField source="name" />
                </SingleFieldList>
            </ReferenceArrayField>

            <ReferenceArrayField source="targetUsers" reference="user" label="Élèves ciblés">
                <SingleFieldList>
                    <ChipField source="displayname" />
                </SingleFieldList>
            </ReferenceArrayField>

            <ShowButton />
            <ExamEditButton />
            
        </Datagrid>
    </List>
);

const DurationField = props => {

    // eslint-disable-next-line react/prop-types
    let seconds = props.record[props.source];
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    let text = hours != 0 ? hours + "h" : "";
    text += minutes != 0 || seconds != 0 ? minutes + "min" : "";
    text += seconds != 0 ? seconds + "s" : "";

    return <span>{text}</span>

}

const ListActions = props => {

    const {
        className,
        exporter,
        filters,
        maxResults,
        ...rest
    } = props;

    const {
        currentSort,
        resource,
        displayedFilters,
        filterValues,
        hasCreate,
        basePath,
        selectedIds,
        showFilter,
        total,
    } = useListContext();

    return (
        <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
            {filters && cloneElement(filters, {
                resource,
                showFilter,
                displayedFilters,
                filterValues,
                context: 'button',
            })}
            <CreateButton basePath={basePath} />
            <ExportButton
                disabled={total === 0}
                resource={resource}
                sort={currentSort}
                filterValues={filterValues}
                maxResults={maxResults}
            />
        </TopToolbar>
    );

}

const ExamEditButton = props => {

    let disabled = props.record["isPublished"];
    return <EditButton basePath="/exam" record={props.record} disabled={disabled} />

}