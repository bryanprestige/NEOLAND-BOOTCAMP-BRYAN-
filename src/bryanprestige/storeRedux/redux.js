//@ts-check
/** @import {Event} from '../java/classes/Event.js' */
 
/**
 * @typedef {Object} ActionTypeEvent
 * @property {String} type
 * @property {Event} [event]
 * 
 */

const ACTION_TYPES = {
    CREATE_EVENT: 'CREATE_EVENT',
    READ_LIST: 'READ_LIST',
 //   FILTER_ARTICLE: 'UPDATE_ARTICLE',
 //   DELETE_ARTICLE: 'DELETE_ARTICLE'
  }
/**
 * @typedef {Object.<(string), any>} State
 * @property {Array<Event>} events
 * @property {boolean} isLoading
 * @property {boolean} error
 */
  /**
   * @type {State}
   */

  export const INITIAL_STATE = {
    events: [],
    isLoading: false,
    error: false
  }

  /**
   * 
   * @param {State} state 
   * @param {ActionTypeEvent} action 
   * @returns {State}
   */


  const appReducer = (state = INITIAL_STATE, action) => {
    const actionWithEvent = /**@type {ActionTypeEvent} */ (action)
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
            default:
                return {...state};
        }
  }
  
/**
 *  * @typedef {Object} PublicMethods
 * * @property {function} create
 * @property {function} getById
 * @property {function} filter
 */

/**
 * @typedef {Object} Store
 * @property {function} getState 
 * @property {PublicMethods} event
 */

/**
 * @param {appReducer} reducer
 * @returns {Store}
 */
  const createStore = (reducer) => {
    let currentState = INITIAL_STATE
    let currentReducer = reducer

 // Actions

  /**
   * @param {Event} event
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
    const createEvent = (event,onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_EVENT, event }, onEventDispatched);
  
    // PUBLIC METHODS
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
            
    // Private methods
   
    /**
     * 
     * @param {ActionTypeEvent} action 
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
        getById : getEventById,
        filter: filterEvents
    }

    return {
      getState,
      event
    }
  }
  
  // Export store
  export const store = createStore(appReducer)