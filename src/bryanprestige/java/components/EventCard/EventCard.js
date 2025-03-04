 
/* //@ts-check */

import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import reset from '../../../css/reset.css' with { type: 'css' }
import appCss from '../../../css/app.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import {onFilterButtonClick,getUserId,navigateTo,getAPIData, PORT,cleanEventContainer,hidePreviewContainer,hideEditProfileForm} from "../../dancingEvents.js"

let totalPriceValue = 0;
let ticketCount = 0;

/**
 * Login Form Web Component
 * @class CardEvent
 * @emits 'event-card'
 */

export class EventCard extends LitElement {
    
    static styles = [ reset,appCss,css];
    static properties = {
        event: {type: Object}, 
        eventUrl: {type: String},
        eventName: {type: String},
        eventPrice: {type: Number},
        eventCurrency: {type: String},
        eventVenue: {type: String},
        eventDateTime: {type: String},
        eventMusic: {type: String},
        eventCity: {type: String},
        eventCountry: {type: String},
        eventDance: {type: String},
        favorited: {type: Boolean, state:true},
        displayMyEvents: {type: Boolean, state:true},
        displayRemoveButton: {type: Boolean, state:true},
        displayTicketCount: {type: Boolean, state:true},
    }

    constructor() {
        super();
        this.displayRemoveButton = false; // Initialize the property to false
        this.displayTicketCount = false
    }
    
    connectedCallback() {
        super.connectedCallback();

        let eventId = this.event._id    
        const userId = getUserId()
        const storageUser = `favList_${userId}`;
        let userFavList = JSON.parse(localStorage.getItem(storageUser)) || [];
        if (userFavList.some(favEvent => favEvent._id === eventId)) {
            this.favorited = true
        }
        this.addEventListener('displayMyEventsChanged', (event) => {
            this.displayMyEvents = event.detail;
          });
    }   

    

    updated(changedProperties) {
        if (changedProperties.has('displayMyEvents')) {
            const button = this.renderRoot.querySelector('.buy-button');
            const editButton = this.renderRoot.querySelector('.vanish-edit-button');
            const removeButton = this.renderRoot.querySelector('.vanish-remove-button');
            
            button.classList.toggle('vanish', !this.displayMyEvents);
            editButton.classList.toggle('appear', !this.displayMyEvents);
            removeButton.classList.toggle('appear', !this.displayMyEvents);

        }

        if (changedProperties.has('displayRemoveButton')) {
            const removeTicketButton = this.renderRoot.querySelector('.remove-ticket-button');
            
            if (removeTicketButton) {
                removeTicketButton.classList.toggle('appear', this.displayRemoveButton);
            }
        }

        if (changedProperties.has('displayTicketCount')) {
            const ticketCountSpan = this.renderRoot.querySelector('.ticket-count');
            if (ticketCountSpan) {
                ticketCountSpan.classList.toggle('appear', this.displayTicketCount);
            }
        }

        if (changedProperties.has('eventDance')) {
            this._getDanceTypeColor();
        }

        if (changedProperties.has('eventMusic')) {
            this._MusicRatioElement();
        }

        console.log('properties have chanded',changedProperties)
    }

     displayEventsConditions(){
        const currentPage = window.location.pathname;

        return currentPage.includes('basket.html') ? 
            html`
                <!-- FIRST HTML BLOCK -->
                <div class="left-column">
                        <img class="event-image" src="../../../imagenes/placehold400x200.png" alt="">
                        <a class="instagram-anchor" href="${this.eventUrl}" target="_blank">
                            <img src="../../../imagenes/instagram.png" alt="instagram image" class="instagram-img">
                        </a>
                    <div class="name-fav">
                        <h1 class="name">${this.eventName}</h1>
                        <button class="fav-button ${this.favorited ? 'favorited' : ''}" @click=${this._toggleFavorite}><img src="../../../imagenes/fav.png"></button> 
                    </div>
                    <div class="price-currency">
                        <h1 class="currency">${this.eventCurrency}</h1>
                        <h1 class="price">${this.eventPrice}</h1>
                    </div>
                    ${this.displayTicketCount ? html`
                    <span class="ticket-count">(${ticketCount})</span>
                ` : ''}
                        <button class="buy-button-basket" @click=${this._onBuyTicketBasketClick}><img src="../../../imagenes/shop.png"></button>  
                        ${this.displayRemoveButton ? html`
                    <button class="remove-ticket-button" @click=${this._removeTicket}>Remove Ticket</button>
                ` : ''}
                    </div>
                <div class="right-column">
                    <div class="reviews-placeholder">Reviews Placeholder
                    </div>
                    <h1 class="venue">${this.eventVenue}</h1>
                    <h1 class="date-time">${this.eventDateTime}</h1>
                    <h1 class="music-ratio">${this.eventMusic}</h1>
                    <div class="city-country">
                        <button class="button-city" @click=${onFilterButtonClick}>${this.eventCity}</button>
                        <button class="button-country" @click=${onFilterButtonClick}>${this.eventCountry}</button>
                    </div>
                    <button class="button-dance-type" @click=${onFilterButtonClick}>${this.eventDance}</button>
                </div>
                `
            :
            html `
             <!-- THIRD HTML BLOCK (original HTML) -->
            <div class="left-column">
                   <img class="event-image" src="../../../imagenes/placehold400x200.png" alt="">
                   <a class="instagram-anchor" href="${this.eventUrl}" target="_blank">
                       <img src="../../../imagenes/instagram.png" alt="instagram image" class="instagram-img">
                   </a>
                   <div class="name-fav">
                       <h1 class="name">${this.eventName}</h1>
                       <button class="fav-button ${this.favorited ? 'favorited' : ''}" @click=${this._toggleFavorite}><img src="../../../imagenes/fav.png"></button>
                   </div>
                   <div class="price-currency">
                       <h1 class="currency">${this.eventCurrency}</h1>
                       <h1 class="price">${this.eventPrice}</h1>
                   </div>
                   <button class="buy-button" @click=${this._onBuyTicketClick}>Buy Ticket</button>
                   <button class="vanish-edit-button" @click=${this._displayEditMyEvents}>Edit Event</button>
               </div>
               <div class="right-column">
                   <div class="reviews-placeholder">Reviews Placeholder
                   </div>
                   <h1 class="venue">${this.eventVenue}</h1>
                   <h1 class="date-time">${this.eventDateTime}</h1>
                   <h1 class="music-ratio">${this.eventMusic}</h1>
                   <div class="city-country">
                       <button class="button-city" @click=${onFilterButtonClick}>${this.eventCity}</button>
                       <button class="button-country" @click=${onFilterButtonClick}>${this.eventCountry}</button>
                   </div>
                   <button class="button-dance-type" @click=${onFilterButtonClick}>${this.eventDance}</button>
                   <button class="vanish-remove-button" @click=${this._removeEvent}>Remove Event</button>
               </div>
           `
        } 

    render() {    
    return html`
        ${this.displayEventsConditions()}
        `
    }   
   /*=========PRIVATE METHODS============*/
   _getDanceTypeColor() {
        const buttonDanceType = this.renderRoot.querySelector('.button-dance-type');
        const danceType = buttonDanceType.textContent.toLowerCase();
        switch (danceType) {
        case 'bachata': return buttonDanceType.style.backgroundColor = 'lightgreen';
        case 'salsa': return buttonDanceType.style.backgroundColor = 'lightyellow';
        case 'tango': return buttonDanceType.style.backgroundColor = '#FF5733';
        case 'zouk': return buttonDanceType.style.backgroundColor = '#33C4FF';
        case 'west coast swing': return buttonDanceType.style.backgroundColor = '#FFC300';
        case 'kizomba': return buttonDanceType.style.backgroundColor = '#fb8500';
        case 'sbk': return buttonDanceType.style.backgroundColor = '#ff006e';
        default: return buttonDanceType.style.backgroundColor = 'white';
        }
    }

    _MusicRatioElement() {
        const musicRatio = this.renderRoot.querySelector('.music-ratio');
        const music = musicRatio.textContent.toLowerCase();
      
        if (music.includes("100%")) {
          musicRatio.classList.add('single-style');
        } else {
          const ratios = music.split(",");
          const className = ratios.length === 2 ? 'three-styles' : 'two-styles';
          musicRatio.classList.add(className);
        }
      }
    _onBuyTicketClick() {
        this._saveBasketToLocalStorage(this.event); 
        navigateTo('./basket.html')
    }

     _onBuyTicketBasketClick () {
        this.displayRemoveButton = true;
        this.displayTicketCount = true;
        this._sumPriceValue()   
        ticketCount++;
        
        let ticketCountSpan = this.renderRoot.querySelector('span');
        console.log('ticketCountSpan',ticketCountSpan);
        if(ticketCountSpan) {
            ticketCountSpan.textContent = `(${ticketCount})`;
        }

        console.log('ticketCountSaved',ticketCount);
        this._updateTicketCount(ticketCount);

    } 

    _removeTicket() {
            this._resPricevalue()
            ticketCount--;
            let ticketCountSpan = this.renderRoot.querySelector('span');
            if(ticketCountSpan) {
                ticketCountSpan.textContent = `(${ticketCount})`;
            }

            console.log('ticketCountSpan',ticketCountSpan);
            if (ticketCount === 0) {
                this.displayTicketCount = false;
                this.displayRemoveButton = false;
            }
            this._updateTicketCount(ticketCount);
    }
    _getPriceValue() {
        const priceElement = this.renderRoot.querySelector('.price');
        const priceValue = priceElement?.textContent?.replace('$', '');
    
        return priceValue;
    }

    _sumPriceValue()  {
        const currentTotalPrice = JSON.parse(localStorage.getItem('totalPriceValue')) || 0;
        const priceValue = this._getPriceValue();
        console.log(`Event price: ${priceValue}`);
    
        totalPriceValue = currentTotalPrice + parseInt(priceValue); 
        localStorage.setItem('totalPriceValue', totalPriceValue); 
        console.log(`Total price: ${totalPriceValue}`);
    }

    _resPricevalue() {
        const currentTotalPrice = JSON.parse(localStorage.getItem('totalPriceValue')) || [];
        console.log(`current total price: ${currentTotalPrice}`);
        const priceValue = this._getPriceValue();
        totalPriceValue  = currentTotalPrice - parseInt(priceValue)
     
        localStorage.setItem('totalPriceValue', totalPriceValue);
        console.log(`Total price: ${totalPriceValue}`);
    }

    _updateTicketCount() {
        let ticketList = JSON.parse(localStorage.getItem('ticketList')) || [];
        const eventIndex = ticketList.findIndex(item => item.name === this.eventName);
        if (eventIndex === -1) {
            ticketList.push({ name: this.eventName, count: ticketCount });
        } else {
            ticketList[eventIndex].count = ticketCount;
        }
        localStorage.setItem('ticketList', JSON.stringify(ticketList));
    }
    _saveBasketToLocalStorage() {
        let basketData = [];
        basketData.push(this.event);
        localStorage.setItem('basket', JSON.stringify(basketData));
    }

    _toggleFavorite() { 
    this.favorited = !this.favorited    
    const userId = getUserId()
    const storageUser = `favList_${userId}`;
    let userFavList = JSON.parse(localStorage.getItem(storageUser)) || []
    const index = userFavList.findIndex(favEvent => favEvent.name === this.event.name);
    if (index === -1) {
        userFavList.push(this.event);

    } else {
        userFavList.splice(index, 1);
    }

    localStorage.setItem(storageUser, JSON.stringify(userFavList));
    }

    _displayEditMyEvents() { 
        let eventId = this.event._id    

        cleanEventContainer()
        hideEditProfileForm()
        hidePreviewContainer()
        
        const eventEditorContainer = document.getElementById('edit-event-form-container')
        eventEditorContainer.style.display = 'block'
        const eventEditor = document.getElementById('event-editor')
        eventEditor.setAttribute('eventId', eventId)
        console.log(eventEditor)
    }
    async _removeEvent () {
    let eventId = this.event._id    
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/delete/event/${eventId}`,'DELETE');
    console.log(apiData)
    alert('Event removed successfully')
    navigateTo('./profile.html')
}  

}

customElements.define('event-card', EventCard)
