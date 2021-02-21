import { fetchUtils } from 'react-admin';
import Axios from 'axios';

import {API_PATH} from '../index'

export default {

    getList: async (resource, params) => {

        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;


        const res = await Axios.get(API_PATH + "/" + resource, {
            params: {
                sort: [field, order],
                range: [(page - 1) * perPage, page * perPage - 1],
                filter: params.filter
            }
        });

        return { data: res.data };

    },

    getOne: async (resource, params) => {

        const res = await Axios.get(API_PATH + "/" + resource + "/" + params.id);
        return { data: res.data };

    },

    getMany: async (resource, params) => {

        const res = await Axios.get(API_PATH + "/" + resource, {
            params: {
                ids: params.ids
            }
        });

        return { data: res.data, total: res.data.length };

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
            data: { ...params.data, id: res._id }
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