import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import appCss from '../../../css/app.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import reset from '../../../css/reset.css' with { type: 'css' }
import {getDataFromSessionStorage,displayCreateEvents,displayMyEvents,displayFavoriteEvents,displayEditForm} from "../../../java/dancingEvents.js"

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

  render() {
    return html`
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
              <button id="my-events-button" @click=${displayMyEvents}>My Events</button>
        </div>
      </div>
    `
  }
  /*=========PRIVATE METHODS============*/
}

customElements.define('create-profile-card', CreateProfileCard);