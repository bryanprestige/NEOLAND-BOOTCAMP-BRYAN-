/*  
//@ts-check
 */

import reset from '../../../css/reset.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import {getAPIData, PORT,getInputValue,hideEditEvents,createEventCardWithAnimation,
        cleanEventContainer,hideCreateEvents,hidePreviewContainer,
        hideEditProfileForm,noEventFound,getUserId} from "../../dancingEvents.js"
/**
 * Edit Event Form  Web Component
 * @class EditEventForm
 * @emits 'edit-event'
 */

export class EditEventForm extends LitElement {
    
    static styles = [ css,reset];
    
    static properties = { 
        prueba: {type: String},
        eventId: {type: String},
    };
    
    constructor() {
        super();
    }
    render() {
        return html `
            <form action="#" id="eventForm">
                <fieldset id="event-fieldset">
                    <legend id="event-editor-legend">Event Editor</legend>
                        <div class="left-column-form">
                            <label> Submit your flyer</label>
                                <input type="file" id="submit-flyer" name="filename">
                                <input type="text" name="input-event-name" id="input-event-name" placeholder="Name of the event" required>
                                <input type="text" name="input-venue" id="input-venue" placeholder="Venue" required>
                                <input type="datetime-local" name="input-dateTime" id="input-dateTime" value="2025-02-10T08:30" required>
                                <input type="url" id="input-url" placeholder="instagram-url">
                        </div>
                        <div class="right-column-form">
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
                            <button type="submit" name="save-changes-button" id="save-changes-button" @click="${this._onSaveChanges}">Save Changes</button>
                            <button type="button" name="cancel-changes-button" id="cancel-changes-button" @click="${this._oncancelChanges}">Cancel</button>
                        </div>
                </fieldset>
            </form> 
        `
    }

    /*=========PRIVATE METHODS============*/

    async _onSaveChanges() {
            
             const newEventName = this.renderRoot.getElementById('input-event-name')
            const newVenue = this.renderRoot.getElementById('input-venue')    
            const newDateTime = this.renderRoot.getElementById('input-dateTime')
            const newPrice = this.renderRoot.getElementById('input-price')
            const newCurrency = this.renderRoot.getElementById('input-currency')
            const newMusic = this.renderRoot.getElementById('input-music-ratio')
            const newCity = this.renderRoot.getElementById('input-city')
            const newCountry = this.renderRoot.getElementById('input-country')
            const newDance = this.renderRoot.getElementById('input-dance')
            const newUrl = this.renderRoot.getElementById('input-url')
            
            let updatedEvent = {
                name: getInputValue(newEventName),
                venue: getInputValue(newVenue),
                dateTime: getInputValue(newDateTime),
                price: getInputValue(newPrice),
                currency: getInputValue(newCurrency),
                music: getInputValue(newMusic),
                city: getInputValue(newCity) ,
                country: getInputValue(newCountry),
                dance: getInputValue(newDance),
                url: getInputValue(newUrl),
            }
        
            const payload = JSON.stringify(updatedEvent)
            const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/update/events/${this.eventId}`, "PUT",payload);
            console.log(apiData)
            if (apiData.matchedCount === 1) {
                alert('Event updated successfully')
                hideEditEvents()
                this._displayMyEvents()
            }else if (apiData.modifiedCount === 0) {
                alert('No changes Detected')
                return
            }
    }    

    _oncancelChanges () {
        hideEditEvents()
        this._displayMyEvents()
    }

      async _displayMyEvents() {
          hideCreateEvents()
          hideEditProfileForm() 
          hidePreviewContainer() 
          hideEditEvents() 
          const userId = getUserId()
          const storageUser = `myEventsList_${userId}`;
          const filterValue = userId;  
          const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/events/${filterValue}`);
      
          if (apiData.length === 0) {
              noEventFound()
           } else {
              
            cleanEventContainer() 
            apiData.forEach(e => {
             if (e.user_id === userId) {
               const myEventCard = createEventCardWithAnimation(e);
               console.log(myEventCard)
             }
           });
              
          }
          this._setEventCardAttributes() 
          localStorage.setItem(storageUser, JSON.stringify(apiData))
        }
    
        _setEventCardAttributes() {
          const displayMyEventsFlag = false
          const eventCards = document.querySelectorAll('.event-card-component');
          eventCards.forEach((eventCard) => {
            eventCard.setAttribute('displayMyEvents', displayMyEventsFlag);
            eventCard.dispatchEvent(new CustomEvent('displayMyEventsChanged', { detail: displayMyEventsFlag }));
          });
        }


}
customElements.define('edit-event-form', EditEventForm)