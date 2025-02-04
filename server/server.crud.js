// INFO: https://www.freecodecamp.org/espanol/news/como-crear-una-aplicacion-crud-de-linea-de-comandos-con-node-js/
// import { read } from './crud/read.js';
import { server } from 'typescript';
import { create } from './crud/create.js';
import {read} from './crud/read.js';
import { filter }from './crud/filter.js';

const EVENTS_URL = 'server/BBDD/events.json'
//const USERS_URL = 'server/BBDD/useres.json'

export const crud = {
    read: (file = EVENTS_URL, callback) => create(file, callback),
    create: (file = EVENTS_URL, data, callback) => create(file, data, callback),
    filter: (file = EVENTS_URL, filterParams, callback) => filter(file, filterParams, callback)
}

console.log(read, server)