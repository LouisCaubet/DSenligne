import { fetchUtils } from 'react-admin';
import Axios from 'axios';

import {API_PATH} from '../index'

export default {

    getList: async (resource, params) => {

        const { page, perPage } = params.pagination;
        let { field, order } = params.sort;

        if(field == "id") field = "_id";

        params.filter._id = params.filter.id;
        params.filter.id = undefined;

        const res = await Axios.get(API_PATH + "/" + resource, {
            params: {
                sort: [field, order],
                range: [(page - 1) * perPage, page * perPage - 1],
                filter: params.filter
            }
        });

        for(let r of res.data.data){
            if(resource == "exam") PatchExam(r);
            if(resource == "user") PatchUser(r);
        }

        console.log(res.data);

        return { data: res.data.data, total: res.data.total };

    },

    getOne: async (resource, params) => {

        const res = await Axios.get(API_PATH + "/" + resource + "/" + params.id);

        if(resource == "exam") PatchExam(res.data);
        if(resource == "user") PatchUser(res.data);

        console.log(res.data)

        return { data: res.data };

    },

    getMany: async (resource, params) => {

        console.log("GetMany called to resource: " + resource);
        console.log(params);

        const res = await Axios.get(API_PATH + "/" + resource, {
            params: {
                ids: JSON.stringify(params.ids)
            }
        });

        for (let r of res.data) {
            if (resource == "exam")
                PatchExam(r);
            if (resource == "user")
                PatchUser(r);
        }

        console.log({ data: res.data });
        return { data: res.data };

        

    },

    getManyReference: async (resource, params) => {

        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;

        const res = await Axios.get(API_PATH + "/" + resource, {
            params: {
                sort: [field, order],
                range: [(page - 1) * perPage, page * perPage - 1],
                filter: {...params.filter, [params.target]: params.id}
            }
        });

        for(let r of res.data){
            if(resource == "exam") PatchExam(r);
            if(resource == "user") PatchUser(r);
        }

        console.log(res.data);

        return { data: res.data, total: res.data.length };

    },

    update: async (resource, params) => {

        const res = await Axios({
            method: "put",
            url: API_PATH + "/" + resource + "/" + params.id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: params.data
        });
        
        return {data:res.data};

    },

    updateMany: async (resource, params) => {

        const res = await Axios({
            method: "put",
            url: API_PATH + "/" + resource,
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                ids: params.ids
            },
            data: params.data
        })

        return { data: res.data, total: res.data.length };

    },

    create: async (resource, params) => {

        const res = await Axios({
            method: "post", 
            url: API_PATH + "/" + resource,
            headers: {
                'Content-Type': 'application/json'
            },
            data: params.data
        });

        return {
            data: { ...res.data, id: res.data._id }
        };

    },

    delete: async (resource, params) => {

        const res = await Axios({
            method: "delete",
            url: API_PATH + "/" + resource + "/" + params.id
        });

        return {
            data: res.data
        };

    },

    deleteMany: async (resource, params) => {

        const res = await Axios({
            method: "delete",
            url: API_PATH + "/" + resource,
            params: {
                ids: params.ids
            }
        });

        return {
            data: res.data
        };

    }

}

function PatchExam(r){

    r.id = r._id;
    r._id = undefined;

    // let targetUsers = []
    // for(let u of r.targetUsers){
    //     targetUsers.push({id: u});
    // }

    // r.targetUsers = targetUsers;

}

function PatchUser(res){

    res.id = res._id;
    res._id = undefined;

    res.displayname = res.firstname + " " + res.lastname;
}