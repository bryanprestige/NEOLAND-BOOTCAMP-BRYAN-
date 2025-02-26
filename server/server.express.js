import express from 'express';
import bodyParser from 'body-parser';
import { db } from "./server.mongodb.js";
import { gooogleOauth2 } from './server.oauth.js';

const app = express();
const port = process.env.port

app.use(express.static('src/bryanprestige'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

// CRUD EVENTS
app.post('/api/create/event', async (req, res) => {  
res.json(await db.events.create(req.body))
})

app.get('/api/read/events', async (req, res) => {
  res.json(await db.events.get())
})
app.put('/api/updateBought/events/:id', requireAuth, async (req, res) => {
  const userId = req.body.boughtBy;
  const updates = { boughtBy: userId };
  const options = { operator: '$addToSet' };
  try {
    const result = await db.events.updateBought(req.params.id, updates, options);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error updating event' });
  }
});

 app.put('/api/update/events/:id',requireAuth, async (req, res) => {

  res.json(await db.events.update(req.params.id, req.body))
})
 
app.delete('/api/delete/event/:id', async (req, res) => {
    res.json(await db.events.delete(req.params.id))
})

app.get('/api/filter/events/:name', async (req, res) => {
  res.json(await db.events.filter({$text: {$search: req.params.name}}))
}) 
  
/////////////////// CRUD USERS///////////////////////////////////
app.post('/api/create/users', async (req, res) => {  
  res.json(await db.users.create(req.body))
})

app.get('/api/read/users', async (req, res) => {
  res.json(await db.users.get());
    
})

app.put('/api/update/users/:id', async (req, res) => {
  console.log(req.params.id,req.body)
  res.json(await db.users.update(req.params.id, req.body))

})

app.delete('/api/delete/user/:id', async (req, res) => {
  res.json(await db.users.delete(req.params.id))
}) 

app.get('/api/filter/users/:nickname', async (req, res) => {
  res.json(await db.users.filter( {$text: {$search: req.params.nickname}}))
})

app.post('/api/login', async (req, res) => {
  const user = await db.users.logIn(req.body)
  if (user) {
    // TODO: use OAuth2
    // ...
    // Simulation of authentication (OAuth2)
    user.token = gooogleOauth2()
    // Remove password
    delete user.password
    res.json(user)
  } else {
    // Unauthorized
    res.status(401).send('Unauthorized')
  }
})

app.get('/api/logout/:id', async (req, res) => {
  const response = await db.users.logOut(req.params.id)
  console.log('logOut', response)
  res.status(200).send('Logout')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function requireAuth(req, res, next) {
  // Simulation of authentication (OAuth2)
  if (req.headers.authorization === 'Bearer 123456') {
    next()
  } else {
    // Unauthorized
    res.status(401).send('Unauthorized')
  }
}