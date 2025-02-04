//@ts-check
/** @import {Event} from '../java/classes/Event.js' */
/** @import {User} from '../java/classes/User.js' */
 
/**
 * @typedef {Object} ActionTypeEvent
 * @property {String} type
 * @property {Event} [event]
 * 
 */

/**
 * @typedef {Object} ActionTypeUser
 * @property {string} type
 * @property {User} [user]
 */
 
const ACTION_TYPES = {
    CREATE_EVENT: 'CREATE_EVENT',
    READ_EVENTS: 'READ_EVENTS',
    CREATE_USER: 'CREATE_USER',
    READ_USERS: 'READ_USERS',

  }

/**
 * @typedef {Object.<(string), any>} State
 * @property {Array<Event>} events
 * @property {Array<User>} user
 * @property {boolean} isLoading
 * @property {boolean} error
 */
  /**
   * @type {State}
   */

  export const INITIAL_STATE = {
    events: [],
    users: [],
    isLoading: false,
    error: false
  }

  /**
   * 
   * @param {State} state 
   * @param {ActionTypeEvent | ActionTypeUser} action 
   * @returns {State}
   */


  const appReducer = (state = INITIAL_STATE, action) => {
    const actionWithEvent = /**@type {ActionTypeEvent} */ (action)
    const actionWithUser = /**@type {ActionTypeUser} */ (action)
    console.log(action)

    switch (action.type) {
            case ACTION_TYPES.CREATE_EVENT:
                return {
                    ...state,
                    events: [
                      ...state.events,
                      actionWithEvent.event
                    ]
                };
              case ACTION_TYPES.READ_EVENTS:
                  return state;
              case ACTION_TYPES.CREATE_USER:
                return {
                  ...state,
                  users: [
                    ...state.users,
                    actionWithUser.user
                  ]
              }
              case ACTION_TYPES.READ_USERS:
                return state;
              default:
                return {...state};
        }
  }
  
/**
 * @typedef {Object} AnswerUser
 * @property {boolean} next
 * @property {boolean} before
 * @property {Array<User>} users
 */

/**
 *  * @typedef {Object} PublicMethods
 * * @property {function} create
 * @property {function} read
 * @property {function} getById
 * @property {function} filter
 */

/**
 * @typedef {Object} Store
 * @property {function} getState 
 * @property {PublicMethods} event
 *  @property {PublicMethods} user
 */

/**
 * @param {appReducer} reducer
 * @returns {Store}
 */
  const createStore = (reducer) => {
    let currentState = INITIAL_STATE
    let currentReducer = reducer

 // ACTIONS EVENTS //

  /**Create a new event
   * @param {Event} event
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
    
  const createEvent = (event,onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_EVENT, event }, onEventDispatched);
  
  /** 
    * Reads the events
    * @param {function | undefined} [onEventDispatched]
    * @returns void
    */
    const readEvents = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.READ_EVENTS }, onEventDispatched);
    /// PUBLIC METHODS EVENTS ///
    const getState = () => { return currentState };

    /**
     * 
     * @param {string} id 
     * @returns {Event}
     */
    const getEventById =(id) => { return currentState.events.find((/**@type {Event} */ event) => event.id === id)}

    /**
     * @param {string} searchField
     * @returns {Array<Event>} 
     */

    const filterEvents = (searchField) => { return currentState.events.filter((/**@type {Event} */ event) =>
            {
             return event.dance.toLowerCase() === searchField ||
              event.city.toLowerCase() === searchField || 
              event.price.toLowerCase() === searchField ||     
              event.name.toLowerCase().includes(searchField)    
             }
            )}
            

    // ACTIONS USERS //

 /**Create a new event
   * @param {User} user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  
    const createUser = (user, onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_USER, user }, onEventDispatched);

     /** 
    * Reads the events
    * @param {function | undefined} [onEventDispatched]
    * @returns void
    */
    const readUsers = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.READ_USERS }, onEventDispatched);

    /// PUBLIC METHODS USERS ///

    /**
     * 
     * @param {string} id 
     * @returns {User}
     */
    const getUserById = (id) => { return currentState.users.find((/**@type {User} */ user) => user.id === id)}
   
     /**
     * @param {string} searchField
     * @returns {Array<Event>} 
     */

    const filterUser = (searchField) => { return currentState.users.filter((/**@type {User} */ user) =>
            {
             return user.rol.toLowerCase() === searchField ||
              user.nickname.toLowerCase().includes(searchField)    
             }
            )}
    // Private methods
   
    /**
     * 
     * @param {ActionTypeEvent | ActionTypeUser} action 
     * @param {function | undefined} [onEventDispatched]

     */
    const _dispatch = (action, onEventDispatched) => {
      let previousValue = currentState;
      let currentValue = currentReducer(currentState, action);
      currentState = currentValue;
      // TODO: CHECK IF IS MORE ADDECUATE TO SWITCH TO EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
      window.dispatchEvent(new CustomEvent('stateChanged', {
          detail: {
              changes: _getDifferences(previousValue, currentValue)
          },
          cancelable: true,
          composed: true,
          bubbles: true
      }));
      if (onEventDispatched) {
          onEventDispatched();
      }
    }

    /**
     * 
     * @param {State} previousValue 
     * @param {State} currentValue 
     * @returns {Object} - A new object with the differences between the two
     *     arguments.
     * @private
     */
    const _getDifferences = (previousValue, currentValue) => {
      return Object.keys(currentValue).reduce((diff, key) => {
          if (previousValue[key] === currentValue[key]) return diff
          return {
              ...diff,
              [key]: currentValue[key]
          };
      }, {});
    }
    
    /*** @type {PublicMethods}*/
    const event = {
        create : createEvent,
        read: readEvents,
        getById : getEventById,
        filter: filterEvents
    }

    const user = {
        create : createUser,
        read : readUsers,
        getById : getUserById,
        filter : filterUser
    }
    return {
      getState,
      event,
      user
    }
  }
  
  // Export store
  export const store = createStore(appReducer)