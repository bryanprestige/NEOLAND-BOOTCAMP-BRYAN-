
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import {getAPIData, PORT} from "../../dancingEvents.js"

/**
 * Login Form Web Component
 * @class LoginForm
 * @emits 'login-form-submit'
 */

export class LoginForm extends LitElement {
  static styles = [ css];

  static properties = {
    prueba: {type: String},
    email: {type: String},
    password: {type: String}
  };

  get _email() {
    return this.renderRoot?.querySelector('#email') ?? null;
  }

  get _password() {
    return this.renderRoot?.querySelector('#password') ?? null;
  }

  constructor() {
    super();
    this.email = '';
    this.password = '';
  }

  render() {
    return html`
     <form action="" id="loginForm" @submit="${this._onFormSubmit}">
        <label for="email">Email:</label>
             <input type="email" id="email" name="email" placeholder="Enter your email" .value="${this.email}" @input="${this._emailChanged}" required autocomplete="on">
        <label for="password">Password:</label>
             <input type="password" id="password" name="password" placeholder="Enter your Password" .value="${this.password}" @input="${this._passwordChanged}" required>
        <div class="wrap"> 
            <button type="submit" id="submit-button-login" ?disabled=${this.email === '' || this.password === ''}>Submit</button>
        </div>
     </form>
    `
  }

  /*=========PRIVATE METHODS============*/
    _emailChanged(e) {
        this.email = e.target.value
    }
    _passwordChanged(e) {
        this.password = e.target.value
    }
   async _onFormSubmit(e) {
    e.preventDefault(); 
          const emailElement = this.renderRoot.querySelector("#email");
          const passwordElement = this.renderRoot.querySelector("#password");
          const email = this._email || emailElement.value;
          const password = this._password || passwordElement.value;
          const loginData = {
              email: email.value,
              password: password.value
            }
            let onFormSubmitEvent
  
            if (loginData.email !== '' && loginData.password !== '') {
              const payload = JSON.stringify(loginData)
              const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/login`, 'POST', payload)
              onFormSubmitEvent = new CustomEvent("login-form-submit", {
                  bubbles: true,
                  detail: apiData
              })
          } else {
              onFormSubmitEvent = new CustomEvent("login-form-submit", {
                bubbles: true,
                detail: null
              })
            }
  
            this.dispatchEvent(onFormSubmitEvent);
      }
}

customElements.define('login-form', LoginForm);