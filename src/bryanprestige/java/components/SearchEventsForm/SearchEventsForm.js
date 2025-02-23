import reset from '../../../css/reset.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import appCss from '../../../css/app.css' with { type: 'css' }
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import {noEventFound,getAPIData, PORT,scrollToTop,cleanEventContainer,createEventCardWithAnimation} from "../../dancingEvents.js"

/**
 * Search Events Form Web Component
 * @class SearchEventsForm
 * @emits 'search-events-form-submit'
 */

export class SearchEventsForm extends LitElement {
    static styles = [ css,reset,appCss];

    static properties = { 
        prueba: {type: String},
      };
    
      constructor() {
        super();
      }
    
      render() {
        return html`
        <form id="search-form">
            <label for="seacher" id="search-label">What are you dancing today?
                <span> You can search by event name, dance, city, country.</span>
            </label>
            <div id="search-section">
                <input type="text" name="dances" id="search-field">
                <button id="search-button" @click=${this._onSearchFormSubmit}>Search</button>
            </div>
        </form>
        `
      }

       /*=========PRIVATE METHODS============*/

      async _onSearchFormSubmit(e) {
          e.preventDefault();
          const searchField = this.renderRoot.getElementById('search-field').value.trim().toLowerCase();
          const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/events/${searchField}`);
       
          const eventContainer = document.querySelector('.event-container');
       
          if (apiData.length === 0) { 
               noEventFound()
          } else {
              cleanEventContainer()
              apiData.forEach(event => createEventCardWithAnimation(event,eventContainer));
          }
          scrollToTop();
      }
}

customElements.define('search-events-form', SearchEventsForm );