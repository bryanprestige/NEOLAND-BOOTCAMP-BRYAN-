/*  
//@ts-check
     */
import reset from '../../../css/reset.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import appCss from '../../../css/app.css' with { type: 'css' }

import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import { getInputValue,getUserId,createPreviewContainer,hideCreateEvents,createEventCardWithAnimation} from "../../dancingEvents.js"
let newEventList = []
/**
 * Create Event Form  Web Component
 * @class CreateEventForm
 * @emits 'create-event'
 */

export class CreateEventForm extends LitElement {
    
    static styles = [ css,reset,appCss];
    
    static properties = { 
        prueba: {type: String},
    };
    
    constructor() {
        super();
    }
    render() {
        return html `
            <form action="#" id="eventForm">
                <fieldset id="event-fieldset">
                    <legend>Event Creator</legend>
                        <div class="left-column">
                            <label> Submit your flyer</label>
                                <input type="file" id="submit-flyer" name="filename">
                                <input type="text" name="input-event-name" id="input-event-name" placeholder="Name of the event" required>
                                <input type="text" name="input-venue" id="input-venue" placeholder="Venue" required>
                                <input type="datetime-local" name="input-dateTime" id="input-dateTime" value="2025-02-10T08:30" required>
                                <input type="url" id="input-url" placeholder="instagram-url">
                        </div>
                        <div class="right-column">
                            <input type="number" name="input-price" id="input-price" placeholder="Price" max="1000" required>
                            <select class="form-select" id="input-currency" name="input-currency" required>
                                <option>select currency</option>
                                <option value="BTC">Bitcoin</option>
                                <option value="ETH">Ethereum</option>
                                <option value="CAD">Canadian Dollar</option>
                                <option value="EUR">Euro</option>
                                <option value="GBP">Pound Sterling</option>
                                <option value="JPY">Japanese Yen</option>
                                <option value="MXN">Mexican Peso</option>
                                <option value="RUB">Russian Ruble</option>
                                <option value="CHF">Swiss Franc</option>
                                <option value="USD">US Dollar</option>   
                             </select>
                            <input type="text" name="input-music-ratio" id="input-music-ratio" placeholder="Music Ratio" required>
                            <input type="text" name="input-city" id="input-city" placeholder="City" required>
                            <input type="text" name="input-country" id="input-country" placeholder="country" required>
                            <input type="text" name="input-dance" id="input-dance" placeholder="Dance" required>
                            <button type="submit" name="submit-button" id="submit-button" @click="${this._onCreateEventFormSubmit}">Preview Event</button>
                        </div>
                </fieldset>
            </form> 
        `
    }

    /*=========PRIVATE METHODS============*/

    _onCreateEventFormSubmit (e) {
        e.preventDefault()
        const newTitleEvent = document.getElementById('main-title-event');
        newTitleEvent.innerText = 'Have a look at your new event, check it out before pusblishing or edit it if you need!';
        
        if (this._validateForm() === false) {
          alert("Please ensure all fields are correctly filled before submitting.");
          return; 
        }else {
          this._createNewEvent()  
          hideCreateEvents()
        }
      } 

      _validateForm() {
        let formIsValid = false;
      
        const fields = [
          'input-event-name',
          'input-venue',
          'input-date',
          'input-time',
          'input-price',
          'input-currency',
          'input-music-ratio',
          'input-city',
          'input-country',
          'input-dance',
      ].map(id => this.renderRoot.getElementById(id));
    
        formIsValid = fields.every(field => field?.value.trim() !== '');
       
        console.log('form is valid',formIsValid); 
          
        const fieldsEmpty = [
            'input-event-name',
            'input-venue',
            'input-date',
            'input-time',
            'input-price',
            'input-currency',
            'input-music-ratio',
            'input-city',
            'input-country',
            'input-dance',
        ].map(id => this.renderRoot.getElementById(id));
    
        formIsValid = fieldsEmpty.every(fieldsEmpty => {
            if (fieldsEmpty?.value.trim() === '') {
                fieldsEmpty?.classList.add('invalid-field');
                return false;
            } else {
                fieldsEmpty?.classList.remove('invalid-field');
                return true;
            }
        });
        return formIsValid
      }

      async _createNewEvent () {
            const timestamp = new Date()
            const name = this.renderRoot.getElementById('input-event-name')
            const venue = this.renderRoot.getElementById('input-venue')    
            const dateTime = this.renderRoot.getElementById('input-dateTime')
            const price = this.renderRoot.getElementById('input-price')
            const currency = this.renderRoot.getElementById('input-currency')
            const music = this.renderRoot.getElementById('input-music-ratio')
            const country = this.renderRoot.getElementById('input-country')
            const city = this.renderRoot.getElementById('input-city')
            const dance = this.renderRoot.getElementById('input-dance')
            const url = this.renderRoot.getElementById('input-url')
      
            const userId = getUserId()
            const event_id = String(timestamp.getTime())
        
            /**
             * @type {Event}
             */
            let event = {
                name: getInputValue(name),
                venue: getInputValue(venue),
                dateTime: getInputValue(dateTime),
                price: getInputValue(price),
                currency: getInputValue(currency),
                music: getInputValue(music),
                city: getInputValue(city),
                country: getInputValue(country),
                dance: getInputValue(dance),
                url: getInputValue(url),
                user_id: userId,
                event_id: event_id
            }
            
            newEventList.push(event)
            console.log('new event list',newEventList)  
            this._saveNewEventToLocalStorage()
            console.log('neweventlist',newEventList)
           
            createEventCardWithAnimation(event)
            createPreviewContainer()
        }
      
        _saveNewEventToLocalStorage () {
          localStorage.setItem('newEventList', JSON.stringify(newEventList));
        }

}

customElements.define('create-event-form', CreateEventForm)