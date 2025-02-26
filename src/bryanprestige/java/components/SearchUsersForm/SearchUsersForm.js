import reset from '../../../css/reset.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import appCss from '../../../css/app.css' with { type: 'css' }
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import {getAPIData, PORT,createUserCardWithAnimation} from "../../dancingEvents.js"

/**
 * Search Events Form Web Component
 * @class SearchUsersForm
 * @emits 'search-Users-form-submit'
 */

export class SearchUsersForm extends LitElement {
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
            <label for="seacher" id="search-label">Connect with fellow dancers!
                <span> You can search by nickname</span>
            </label>
            <div id="search-section">
                <input type="text" name="dances" id="search-field">
                <button id="search-button" @click=${this._onSearchUserButtonClick}>Search</button>
            </div>
        </form>
        `
      }
       /*=========PRIVATE METHODS============*/

    async _onSearchUserButtonClick (e){
      e.preventDefault()
      const searchField = this.renderRoot.getElementById('search-field').value.trim().toLowerCase();
      const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/users/${searchField}`);
      console.log(apiData)  
      //const userCardContainer = document.querySelector('.user-card-container');
       if (apiData.length === 0) { 
                     console.log('user not found')
                } else {
                    apiData.forEach(user => createUserCardWithAnimation(user));
                }
    } 
}

customElements.define('search-users-form', SearchUsersForm );