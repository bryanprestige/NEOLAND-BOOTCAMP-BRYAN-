// server.statics.js
// import * as fs from "node:fs";
import * as http from "node:http";
// import * as path from "node:path";
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

http
  .createServer(async (request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const statusCode = 200
    let responseData = []
    console.log(`${request.method} ${request.url} ${statusCode}`);
    // Determine if the request is creating a new user

    console.log(url.pathname, url.searchParams);
    // Set Up CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', MIME_TYPES.json);
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(statusCode);

    switch (url.pathname) {
      case '/create/events':
        crud.create(EVENTS_URL, url.searchParams, (data) => {
          console.log(`server ${data.name} creado`, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;
      case '/read/events':
        crud.read(EVENTS_URL, (data) => {
          console.log('server read articles', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;
      case '/filter/events':
        crud.filter(EVENTS_URL, url.searchParams, (data) => {
          console.log('server filter articles', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;
      default:
        console.log('no se encontro el endpoint');

        response.write(JSON.stringify('no se encontro el endpoint'));
        response.end();
        break;
    }


  })
  .listen(process.env.API_PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.API_PORT + '/');