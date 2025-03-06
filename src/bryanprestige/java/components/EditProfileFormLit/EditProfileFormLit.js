/*  
//@ts-check
 */
import reset from '../../../css/reset.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }

import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import {getUserId,getInputValue,getAPIData,
PORT,getDataFromSessionStorage,updateSessionStorage, 
navigateTo,hideEditProfileForm} from "../../../java/dancingEvents.js"

/**
 * Edit Profile Form Web Component
 * @class EditProfileForm
 * @emits 'edit-profile-form-submit'
 */

export class EditProfileForm extends LitElement {
  static styles = [ css,reset];

  static properties = { 
    prueba: {type: String},
  };

  constructor() {
    super();
  }

  render() {
    return html `
     <form action="#" id="edit-profile-form">
        <fieldset class="edit-form-container">
            <legend>Profile Editor</legend>
            <label for="input-new-nickname"><b>Nickname</b></label>
                <input type="text" placeholder="Edit Nickname" name="input-new-nickname" id="input-new-nickname" required>
            <label for="input-team-academy"><b>Team/Academy</b></label>
                <input type="text" placeholder="Enter Team-Academy Name" name="input-team-academy" id="input-team-academy">
            <label for="input-new-rol"><b>Role</b></label>
            <select name="input-new-rol" id="input-new-rol" >
                <option value="Leader">Leader</option>
                <option value="Follower">Follower</option>
                <option value="Both">Both</option>
            </select>
            <label for="input-bio"> About you, max 140 characters</label>
                <textarea name="bio" id="input-bio" cols="20" rows="8" maxlength="140">
                </textarea>
            <div>
                <button type="button" id="submit-new-user-data" @click="${this._updateProfile}" >Save Changes</button>
                <button type="button" id="cancel-edit-profile-button" @click="${hideEditProfileForm}" >Cancel</button>
            </div>
        </fieldset>
      </form>
    `
  }

  /*=========PRIVATE METHODS============*/

  async _updateProfile() {
    const userId = getUserId() 
    const newNickname = this.renderRoot.getElementById('input-new-nickname')
    const newRol = this.renderRoot.getElementById('input-new-rol')
    const newTeamAcademy = this.renderRoot.getElementById('input-team-academy')
    const newBio = this.renderRoot.getElementById('input-bio').value.trim()

     let newUser = {
            nickname: getInputValue(newNickname),
            rol: getInputValue(newRol),
            teamAcademy: getInputValue(newTeamAcademy),
            bio: newBio
        }

      const payload = JSON.stringify(newUser)
      console.log(payload)
      const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/update/users/${userId}`, "PUT",payload);
      if (apiData.modifiedCount === 1) {
        const userData =  getDataFromSessionStorage()
        const updatedData = {
            user:
            {...userData.user,
            nickname: newUser.nickname,
            rol: newUser.rol,
            teamAcademy: newUser.teamAcademy,
            bio: newUser.bio
            }
        }
        updateSessionStorage(updatedData)        
    }

    navigateTo('./profile.html')
  }
}

customElements.define('edit-profile-form', EditProfileForm );