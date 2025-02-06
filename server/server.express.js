import express from 'express';
import bodyParser from 'body-parser';
import { crud } from "./server.crud.js";

const app = express();
const port = process.env.port
const EVENTS_URL = './server/BBDD/events.json'
const USERS_URL = './server/BBDD/users.json'

//let chunks = []
//et responseData = []

app.use(express.static('src/bryanprestige'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

// CRUD EVENTS
app.post('/create/events', (req, res) => {
    crud.create(EVENTS_URL, req.body, (data) => {
      res.json(data)
    });
  })
  app.get('/read/events', (req, res) => {
    crud.read(EVENTS_URL, (data) => {
      res.json(data)
    });
  })
  app.put('/update/events/:id', (req, res) => {
    crud.update(EVENTS_URL, req.params.id, req.body, (data) => {
      res.json(data)
    });
  })
  app.delete('/delete/events/:id', async (req, res) => {
    await crud.delete(EVENTS_URL, req.params.id, (data) => {
      res.json(data)
    });
  })

  app.get('/filter/events/:search', (req, res) => {
    crud.filter(EVENTS_URL,{search:req.params.search}, (data) => {
      res.json(data)
    });
  })
  
  // CRUD USERS
app.post('/create/users', (req, res) => {
    crud.create(USERS_URL, req.body, (data) => {
      res.json(data)
    });
  })
  app.get('/read/users', (req, res) => {
    crud.read(USERS_URL, (data) => {
      res.json(data)
    });
  })
  app.put('/update/users/:id', (req, res) => {
    crud.update(USERS_URL, req.params.id, req.body, (data) => {
      res.json(data)
    });
  })
  app.delete('/delete/users/:id', async (req, res) => {
    await crud.delete(USERS_URL, req.params.id, (data) => {
      res.json(data)
    });
  })

  app.get('/filter/users', (req, res) => {
    crud.filter(USERS_URL,req.body, (data) => {
      res.json(data)
    });
  })
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})