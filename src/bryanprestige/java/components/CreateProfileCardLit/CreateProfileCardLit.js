import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import appCss from '../../../css/app.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import reset from '../../../css/reset.css' with { type: 'css' }
import {noEventFound,createEventCardWithAnimation,cleanEventContainer,getAPIData, PORT,getUserId,hidePreviewContainer,hideEditProfileForm,getDataFromSessionStorage,displayCreateEvents,hideCreateEvents,hideEditEvents,displayFavoriteEvents,displayEditForm} from "../../../java/dancingEvents.js"

/**
 * Login Form Web Component
 * @class createProfileCard
 * @emits 'create-profile-card'
 */

export class CreateProfileCard extends LitElement {
  static styles = [ appCss,css,reset];

  static properties = {
    prueba: {type: String},
  };

  get _nickname() {
    const getUser = getDataFromSessionStorage();
    const user = getUser.user;
    const nickname = user.nickname;
    return  nickname
  }

  get _bio() {
    const getUser = getDataFromSessionStorage();
    const user = getUser.user;
    const rol = user.rol
    const bio = user.bio;
    if(!bio) {
        return `Describe yourself. Role: ${rol}`;
    }else{
        return  `${bio}. Role: ${rol}`
    }
  }

    get _teamAcademy() {
        const getUser = getDataFromSessionStorage();
        const user = getUser.user;
        
        const teamAcademy = user.teamAcademy;
        if(!teamAcademy) {
        return `Show support to your team/academy.`;
        } else {
          return  teamAcademy
        }   
    }

  constructor() {
    super();
  }

  displayUserConditions(){
          const currentPage = window.location.pathname;
  
          return currentPage.includes('reviews.html') ? 
              html`
                  <!-- FIRST HTML BLOCK -->
                  <div class="profile-card">
                <img class="profile-picture" src="../../../imagenes/profile-pic-placeholder.png">
                <div class="profile-info">
                    <h1 class="nickname">${this._nickname}</h1>
                    <p class="bio">${this._bio}</p>
                    <p class="team-academy">${this._teamAcademy}</p>    
                    <form>
                      <label for="technique">Technique</label>
                        <select> 
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      <label for="dance-style">Style</label>
                        <select> 
                          <option value="Bachata Sensual">Bachata Sensual</option>
                          <option value="Bachata Moderna">Bachata Moderna</option>
                          <option value="Bachata Traditional">Bachata Traditional</option>
                          <option value="Salsa on 1">Salsa on 1</option>
                          <option value="Salsa on 2">Salsa on 2</option>
                          <option value="Salsa cali">Salsa cali </option>
                          <option value="Zouk">Zouk</option>
                          <option value="Kizomba">Kizomba</option>
                          <option value="Merengue">Merengue</option>
                          <option value="West Coast Swing">West Coast Swing</option>
                          <option value="Bachazouk">Bachazouk</option>
                        </select>
                      <label for="comments">Comments</label>
                        <textarea id="comments" name="comments"  cols="20" rows="4"placeholder="Comments"></textarea>
                      <button type="submit">Submit</button>
                    </form>
                </div>
              </div>
            `
              :
              html`
              <!-- SECOND HTML BLOCK (original HTML) -->
            <div class="profile-card">
                <img class="profile-picture" src="../../../imagenes/profile-pic-placeholder.png">
                <div class="profile-info">
                    <h1 class="nickname">${this._nickname}</h1>
                    <p class="bio">${this._bio}</p>
                    <p class="team-academy">${this._teamAcademy}</p>    
                    <div class="edit-fav-profile">
                      <button id="edit-profile-button" @click=${displayEditForm}>Edit Profile</button>
                      <button id="fav-button-profile" @click=${displayFavoriteEvents}>Favourites</button>
                    </div>
                    <div class="create-myEvents-profile">
                      <button id="create-events-button" @click=${displayCreateEvents}>Create Events</button>
                      <button id="my-events-button" @click=${this._displayMyEvents}>My Events</button>
                    </div>
                </div>
              </div>
            `
          } 

  render() {
    return html`
      ${this.displayUserConditions()}
    `
  }
  /*=========PRIVATE METHODS============*/

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
            const myEventCard = createEventCardWithAnimation(e);
            console.log(myEventCard)
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

customElements.define('create-profile-card', CreateProfileCard);