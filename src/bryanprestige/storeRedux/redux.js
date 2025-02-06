//@ts-check
/** @import {User} from '../java/classes/User.js' */
 

/**
 * @typedef {Object} ActionTypeUser
 * @property {string} type
 * @property {User} [user]
 */
 
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} [password]
 * @property {string} token
 * @property {string} role
 */

const ACTION_TYPES = {
  //USER
  LOGIN : 'LOGIN ',
  LOGOUT: 'LOGOUT'

  }

/**
 * @typedef {Object.<(string), any>} State
 * @property {Array<User>} user
 * @property {boolean} isLoading
 * @property {boolean} error
 */
  /**
   * @type {State}
   */

  export const INITIAL_STATE = {
    users: [],
    isLoading: false,
    error: false
  }

  /**
   * 
   * @param {State} state 
   * @param  {ActionTypeUser} action 
   * @returns {State}
   */


  const appReducer = (state = INITIAL_STATE, action) => {
    const actionWithUser = /**@type {ActionTypeUser} */ (action)

    switch (action.type) {
      case ACTION_TYPES.LOGIN:
        return {
          ...state,
          user: actionWithUser.user
        };
      case ACTION_TYPES.LOGOUT:
        return {
          ...state,
          user: {}
        };
              default:
                return {...state};
        }
  }
  

/**
 * @typedef {Object} PublicUser
 * @property {function} getById
 * @property {function} filter
 * @property {function} login
 * @property {function} logout
 */



/**
 * @typedef {Object} Store
 * @property {function} getState 
 *  @property {PublicUser} user
 */

/**
 * @param {appReducer} reducer
 * @returns {Store}
 */
  const createStore = (reducer) => {
    let currentState = INITIAL_STATE
    let currentReducer = reducer

 // ACTIONS EVENTS //

    

    /// PUBLIC METHODS EVENTS ///
    const getState = () => { return currentState };

            
    // ACTIONS USERS //

    /// PUBLIC METHODS USERS ///
  /**
   * Logs in the user
   * @param {User} user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const login = (user, onEventDispatched) => _dispatch({ type: ACTION_TYPES.LOGIN, user }, onEventDispatched)

  /**
   * Logs out the user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const logout = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.LOGOUT }, onEventDispatched)
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
     * @param { ActionTypeUser} action 
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
    
    /*** @type {PublicUser}*/
  

    const user = {
        getById : getUserById,
        filter : filterUser,
        login,
        logout
    }
    return {
      getState,
      user
    }
  }
  
  // Export store
  export const store = createStore(appReducer)