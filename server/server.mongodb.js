import { MongoClient, ObjectId } from "mongodb";

const URI = process.env.MONGO_URI

export const db = {
    events: {
        create: createEvent,
        get: getEvents,
        updateBought : updateBoughtEvent,
        update: updateEvent,
        delete: deleteEvent,
        filter: filterEvents,
    },
    users:{
        create: createUser,
        get: getUsers,
        update: updateUser,
        followedBy : updateFollowers,
        delete: deleteUser,
        filter: filterUsers,
        filterById: filterUserById,
        count: countUsers,
        logIn: logInUser,
        logOut: logoutUser
    },
    ratings: {
        create: createRating,
        get: getRatings,
        update: updateRating,
        delete: deleteRating,
        filter: filterRatings
    }
}


/*=======USERS=======*/

async function countUsers(){
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const usersCollection = dancingEventsDB.collection('users');
    console.log('db checkConnection', usersCollection)
    return await usersCollection.countDocuments();
}

async function createUser(user){
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const usersCollection = dancingEventsDB.collection('users');
    const returnValue = await usersCollection.insertOne(user);
    console.log('db createUser', returnValue, user._id)
    return user;
}


async function getUsers(){
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const usersCollection = dancingEventsDB.collection('users');
    return await usersCollection.find().toArray();
}
/**
 * Updates an article in the 'articles' collection in the 'shoppingList' database.
 *
 * @param {string} id - The ID of the article to be updated.
 * @param {object} updates - The fields and new values to update the article with.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
async function updateUser(id, updates) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const usersCollection = dancingEventsDB.collection('users');
    const returnValue = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    console.log('db updateUser', returnValue, updates)
    return returnValue
}

/**
 *
 * @param {string} _id - The ID of the event to be updated.
 * @param {object} updates - The fields and new values to update the event with.
 * @param {object} [options] - The options for the update operation.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */

async function updateFollowers(_id, updates, options = {}) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const usersCollection = dancingEventsDB.collection('users');
  
    if (Object.keys(updates).length === 1 && updates.followedBy) {
      // update a single field with a value
      const updateOperator = options.operator || '$addToSet';
      let update = { [updateOperator]: { followedBy: updates.followedBy } };
  
      const userDoc = await usersCollection.findOne({ _id: new ObjectId(_id) });
      if (!userDoc.followedBy || !Array.isArray(userDoc.followedBy)) {
        await usersCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { followedBy: [] } });
      }
  
      const returnValue = await usersCollection.updateOne({ _id: new ObjectId(_id) }, update);
      return returnValue;
    } else {
      // update multiple fields with a payload
      let update = { $set:updates };
      const returnValue = await usersCollection.updateOne({ _id: new ObjectId(_id) }, update);
      return returnValue;
    }
}  

/**
 * @param {string} id -the id of the event to be deleted
 * @returns {Promise<object>} the id of the deleted event
 */

async function deleteUser(id) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const usersCollection = dancingEventsDB.collection('users');
    const returnValue = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteUser', returnValue, id)
    return id
}


/**
 * Finds a user in the 'users' collection in the 'shoppingList' database given
 * an email and password.
 *
 * @param {{email: string, password: string}} data - The data to query the user.
 * @returns {Promise<object>} The user object if found, null otherwise.
 */
async function logInUser({email, password}) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const usersCollection = dancingEventsDB.collection('users');
    return await usersCollection.findOne({ email, password })
  }

/**
 * Logs out a user by setting the 'token' field to null in the 'users' collection
 * in the 'shoppingList' database.
 *
 * @param {{id: string}} data - The data to query the user.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
async function logoutUser({id}) {
    const client = new MongoClient(URI);
    const shoppinglistDB = client.db('shoppingList');
    const usersCollection = shoppinglistDB.collection('users');
    return await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { token: null } })
  }

/**
 * Filter the events from the database
 * 
 * @param {object} [filter]  - filter to apply to the evetns
 * @returns {Promise<Array<object>>} - the array of the event
 */
async function filterUsers(filter){
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const usersCollection = dancingEventsDB.collection('users');
    return await  usersCollection.find(filter).toArray();
}

/**
 * Updates an article in the 'articles' collection in the 'shoppingList' database.
 *
 * @param {string} id - The ID of the article to be updated.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */
async function filterUserById(id) {
  const client = new MongoClient(URI);
  const dancingEventsDB = client.db('dancingEvents');
  const usersCollection = dancingEventsDB.collection('users');
  const returnValue = await usersCollection.findOne({ _id: new ObjectId(id) });
  console.log('db filterUserById', returnValue)
  return returnValue
}

/*===============EVENTS==============*/

/**
 * Creates a new event in the 'events' collection in the 'dancingEvents' database.
 *
 * @param {object} event - The event to be created.
 * @returns {Promise<object>} The created event.
 */

async function createEvent(event){
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const eventsCollection = dancingEventsDB.collection('events');
    const returnValue = await eventsCollection.insertOne(event);
    console.log('db createEvent', returnValue, event.name)
    return event;
}

/**
 * Filter the events from the database
 * 
 * @param {object} [filter]  - filter to apply to the evetns
 * @returns {Promise<Array<object>>} - the array of the event
 */

async function getEvents(filter){
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const eventsCollection = dancingEventsDB.collection('events');
    return await  eventsCollection.find(filter).toArray();
}
/**
 * Updates an event in the 'events' collection in the 'dancingEvents' database.
 *
 * @param {string} _id - The ID of the event to be updated.
 * @param {object} updates - The fields and new values to update the event with.
 * @param {object} [options] - The options for the update operation.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */

async function updateBoughtEvent(_id, updates, options = {}) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const eventsCollection = dancingEventsDB.collection('events');
  
    if (Object.keys(updates).length === 1 && updates.boughtBy) {
      // update a single field with a value
      const updateOperator = options.operator || '$addToSet';
      let update = { [updateOperator]: { boughtBy: updates.boughtBy } };
  
      const eventDoc = await eventsCollection.findOne({ _id: new ObjectId(_id) });
      if (!eventDoc.boughtBy || !Array.isArray(eventDoc.boughtBy)) {
        await eventsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { boughtBy: [] } });
      }
  
      const returnValue = await eventsCollection.updateOne({ _id: new ObjectId(_id) }, update);
      return returnValue;
    } else {
      let update = { $set: updates };
      const returnValue = await eventsCollection.updateOne({ _id: new ObjectId(_id) }, update);
      return returnValue;
    }
  }

  /**
 * Updates an article in the 'articles' collection in the 'shoppingList' database.
 *
 * @param {string} _id - The ID of the event to be updated.
 * @param {object} updates - The fields and new values to update the event with.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */

async function updateEvent(_id, updates) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const eventsCollection = dancingEventsDB.collection('events');
    const returnValue = await eventsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: updates });
    console.log('db updateEvent', await eventsCollection.findOne({ _id: new ObjectId(_id) }))
    return returnValue
}

/**
 * @param {string} id -the id of the event to be deleted
 * @returns {Promise<object>} the id of the deleted event
 */

async function deleteEvent(id) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const eventsCollection = dancingEventsDB.collection('events');
    const returnValue = await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteArticle', returnValue, id)
    return id
}

/**
 * Filter the events from the database
 * 
 * @param {object} [filter]  - filter to apply to the evetns
 * @returns {Promise<Array<object>>} - the array of the event
 */
async function filterEvents(filter){
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const eventsCollection = dancingEventsDB.collection('events');
    return await  eventsCollection.find(filter).toArray();
}


/*===============RATINGS==============*/


/**
 * Creates a new event in the 'events' collection in the 'dancingEvents' database.
 *
 * @param {object} rating - The event to be created.
 * @returns {Promise<object>} The created event.
 */

async function createRating(rating){
  const client = new MongoClient(URI);
  const dancingEventsDB = client.db('dancingEvents');
  const ratingsCollection = dancingEventsDB.collection('ratings');
  const returnValue = await ratingsCollection.insertOne(rating);
  console.log('db createEvent', returnValue, rating.name)
  return rating;
}

/**
* Filter the events from the database
* 
* @param {object} [filter]  - filter to apply to the evetns
* @returns {Promise<Array<object>>} - the array of the event
*/

async function getRatings(filter){
  const client = new MongoClient(URI);
  const dancingEventsDB = client.db('dancingEvents');
  const ratingsCollection = dancingEventsDB.collection('ratings');
  return await  ratingsCollection.find(filter).toArray();
}

  /**
 * Updates an article in the 'articles' collection in the 'shoppingList' database.
 *
 * @param {string} _id - The ID of the event to be updated.
 * @param {object} updates - The fields and new values to update the event with.
 * @returns {Promise<UpdateResult>} The result of the update operation.
 */

  async function updateRating(_id, updates) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const ratingsCollection = dancingEventsDB.collection('ratings');
    const returnValue = await ratingsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: updates });
    console.log('db updateRating', await ratingsCollection.findOne({ _id: new ObjectId(_id) }))
    return returnValue
}

/**
 * @param {string} id -the id of the event to be deleted
 * @returns {Promise<object>} the id of the deleted event
 */

async function deleteRating(id) {
    const client = new MongoClient(URI);
    const dancingEventsDB = client.db('dancingEvents');
    const ratingsCollection = dancingEventsDB.collection('ratings');
    const returnValue = await ratingsCollection.deleteOne({ _id: new ObjectId(id) });
    console.log('db deleteRating', returnValue, id)
    return id
}

/**
 * Filter the events from the database
 * 
 * @param {object} [filter]  - filter to apply to the evetns
 * @returns {Promise<Array<object>>} - the array of the event
 */
async function filterRatings(filter){
  const client = new MongoClient(URI);
  const dancingEventsDB = client.db('dancingEvents');
  const ratingsCollection = dancingEventsDB.collection('ratings');
  return await  ratingsCollection.find(filter).toArray();
}