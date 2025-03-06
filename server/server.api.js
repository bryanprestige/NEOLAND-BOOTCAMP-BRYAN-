
import * as qs from "node:querystring";
import * as http from "node:http";
import { crud } from "./server.crud.js";

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const EVENTS_URL = './server/BBDD/events.json'
const USERS_URL = './server/BBDD/users.json'

function getAction (pathname) {
  const actionParts = pathname.split('/');
  return {
    name: `/${actionParts[1]}/${actionParts[2]}`,
    id: actionParts[3]
  }
}

http
  .createServer(async (request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const urlParams = Object.fromEntries(url.searchParams);
    const action = getAction(url.pathname);
    const statusCode = 200
    let responseData = []
    let chunks = []
 
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', MIME_TYPES.json);
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(statusCode);

    if (request.method === 'OPTIONS') {
      response.end();
      return;
    }

    switch (action.name) {
      case '/create/events':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.create(EVENTS_URL, parsedData, (data) => {
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
        break;
      case '/read/events':
        crud.read(EVENTS_URL, (data) => {
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;
        case '/update/events':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.update(EVENTS_URL, action.id, parsedData, (data) => {
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
        break;
        case '/delete/events':
          crud.delete(EVENTS_URL, action.id, (data) => {
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          })
          break;
      case '/filter/events':
        crud.filter(EVENTS_URL, urlParams, (data) => {
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;
        case '/create/users':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.create(USERS_URL, parsedData, (data) => {
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
        break;
        case '/read/users':
          crud.read(USERS_URL, (data) => {
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          });
        break;
        case '/update/users':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.update(USERS_URL, action.id, parsedData, (data) => {
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;
        case '/delete/users':
          crud.delete(USERS_URL, action.id, (data) => {
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          })
          break;
        case '/filter/users':
          crud.filter(USERS_URL, urlParams, (data) => {
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          })
          break;
        default:
  
          response.write(JSON.stringify('no se encontro el endpoint'));
          response.end();
          break;
    }
})
  .listen(process.env.API_PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.API_PORT + '/');