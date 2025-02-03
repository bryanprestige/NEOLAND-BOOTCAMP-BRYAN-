// /server/index.js
import * as http from "node:http";
import * as url from "node:url";

const eventsJSON= `[
    {
      "id": 1,
      "name": "Bachata Exchange",
      "location": "12 Primrose Street",
      "dateTime": "27 March 2025 17:00",
      "price": "0",
      "currency": "GBP",
      "music": "Bachata 100%",
      "city": "London",
      "dance": "Bachata"
    },
    {
      "id": 2,
      "name": "Jowke",
      "location": "Mostoles",
      "dateTime": "5 April 2026 23:00",
      "price": "20",
      "currency": "EUR",
      "music": "Bachata/Zouk 80,20",
      "city": "Madrid",
      "dance": "Bachata"
    },
    {
      "id": 3,
      "name": "Lokura",
      "location": "La Ermita",
      "dateTime": "8 May 2025 22:00",
      "price": "15",
      "currency": "EUR",
      "music": "Swing 100%",
      "city": "Madrid",
      "dance": "West Swign Coast"
    },
    {
      "id": 4,
      "name": "Salseritos",
      "location": "La Grande Figa 22",
      "dateTime": "14 May 2025 19:00",
      "price": "30",
      "currency": "EUR",
      "music": "SBK 2,8,1",
      "city": "Milan",
      "dance": "Salsa"
    },
    {
      "id": 5,
      "name": "Zouk Fever",
      "location": "Passeig de Gracia 45",
      "dateTime": "2 June 2026 21:00",
      "price": "18",
      "currency": "EUR",
      "music": "Zouk 100%",
      "city": "Barcelona",
      "dance": "Zouk"
    },
    {
      "id": 6,
      "name": "Salsa Nights",
      "location": "Calle Mayor 15",
      "dateTime": "10 June 2025 20:00",
      "price": "25",
      "currency": "EUR",
      "music": "Salsa 100%",
      "city": "Madrid",
      "dance": "Salsa"
    },
    {
      "id": 7,
      "name": "Kizomba Love",
      "location": "Plaza Catalunya 10",
      "dateTime": "5 July 2025 22:00",
      "price": "12",
      "currency": "EUR",
      "music": "Kizomba 100%",
      "city": "Barcelona",
      "dance": "Kizomba"
    },
    {
      "id": 8,
      "name": "SBK Fusion",
      "location": "Via Roma 33",
      "dateTime": "15 August 2025 21:00",
      "price": "20",
      "currency": "EUR",
      "music": "SBK 3,3,4",
      "city": "Rome",
      "dance": "SBK"
    },
    {
      "id": 9,
      "name": "Timba Explosion",
      "location": "Calle 8, Miami",
      "dateTime": "30 September 2025 19:30",
      "price": "22",
      "currency": "USD",
      "music": "Timba 100%",
      "city": "Miami",
      "dance": "Salsa"
    },
    {
      "id": 10,
      "name": "Urban Bachata",
      "location": "Sunset Blvd 100",
      "dateTime": "12 October 2025 20:00",
      "price": "18",
      "currency": "USD",
      "music": "Bachata 100%",
      "city": "Los Angeles",
      "dance": "Bachata"
    },
    {
      "id": 11,
      "name": "Kiz Sensation",
      "location": "Porto Center",
      "dateTime": "8 November 2025 22:30",
      "price": "15",
      "currency": "EUR",
      "music": "Kizomba 100%",
      "city": "Porto",
      "dance": "Kizomba"
    },
    {
      "id": 12,
      "name": "Zouk Connection",
      "location": "Copacabana Club",
      "dateTime": "21 December 2025 21:00",
      "price": "19",
      "currency": "BRL",
      "music": "Zouk 100%",
      "city": "Rio de Janeiro",
      "dance": "Zouk"
    },
    {
      "id": 13,
      "name": "Bachata Sunset",
      "location": "Santorini Beach",
      "dateTime": "5 May 2026 19:00",
      "price": "17",
      "currency": "EUR",
      "music": "Bachata 100%",
      "city": "Santorini",
      "dance": "Bachata"
    },
    {
      "id": 14,
      "name": "Caribbean Party",
      "location": "Havana Club",
      "dateTime": "10 June 2026 22:00",
      "price": "20",
      "currency": "CUP",
      "music": "Salsa/Bachata 50,50",
      "city": "Havana",
      "dance": "SBK"
    },
    {
      "id": 15,
      "name": "Tango Nights",
      "location": "Buenos Aires Plaza",
      "dateTime": "25 July 2026 21:00",
      "price": "30",
      "currency": "ARS",
      "music": "Tango 100%",
      "city": "Buenos Aires",
      "dance": "Tango"
    }
  ]`

http.createServer(function server_onRequest (request, response) {
    let pathname = url.parse(request.url).pathname;

    console.log(`Request for  ${pathname}  received.`);

    response.setHeader ('Access-Control-Allow-Origin', '*');
    response.setHeader('content-type', 'application/json');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('access-control-max-age', 2592000); //30 days
    response.writeHead(200)
    
    response.write(eventsJSON);
    response.end();
}).listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');

