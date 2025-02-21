import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import reset from '../../../css/reset.css' with { type: 'css' }
import appCss from '../../../css/app.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import {getAPIData,PORT,setLocalStorageFromState, onFilterButtonClick,handleBuyButtonClick,toggleFavorite} from "../../dancingEvents.js"


/**
 * Login Form Web Component
 * @class CardEvent
 * @emits 'event-card'
 */

export class EventCard extends LitElement {
    static styles = [ reset,appCss,css];
    static properties = {
        prueba: {type: String}, 
    };

    constructor() {
        super();
    }
  
    render() {

    return html`
        <div class="event-card-component">
            <div class="left-column">
                <img class="event-image" src="../../../imagenes/placehold400x200.png" alt="">
                <a class="instagram-anchor" href="" target="_blank">
                    <img src="../../../imagenes/instagram.png" alt="instagram image" class="instagram-img">
                </a>
                <div class="name-fav">
                    <h1 class="name"></h1>
                    <button class="fav-button" @click=${toggleFavorite}><img src="../../../imagenes/fav.png"></button>
                </div>
                <div class="price-currency">
                    <h1 class="currency">GBP</h1>
                    <h1 class="price">23</h1>
                </div>
                <button class="buy-button" @click=${handleBuyButtonClick}><img src="../../../imagenes/shop.png" alt="shop" class="shop-img"></button>
            </div>
            <div class="right-column">
                <div class="reviews-placeholder">Reviews Placeholder
                </div>
                <h1 class="venue"></h1>
                <h1 class="date-time"></h1>
                <h1 class="music-ratio single-style"></h1>
                <div class="city-country">
                    <button class="button-city" @click=${onFilterButtonClick}>Madrid</button>
                    <button class="button-country" @click=${onFilterButtonClick}>Spain</button>
                </div>
                <button class="button-dance-type" @click=${onFilterButtonClick}>Bachata</button>
            </div>
        </div>
        `
    }   
   /*=========PRIVATE METHODS============*/
    async _showFeed() {
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/read/events?`,'GET');
        console.log(apiData)
        const eventContainer = document.querySelector('.event-container');
            apiData.forEach(event => {
                this.render(event, eventContainer);
                setLocalStorageFromState(this, 'eventStorage')
            });
    }

}

customElements.define('event-card', EventCard)
