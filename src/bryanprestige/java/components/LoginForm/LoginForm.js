import {getAPIData, getInputValue, PORT} from "../../dancingEvents.js"
import appCss from '../../../css/app.css' with { type: 'css' }
import LoginFormCSS from './LoginFormCSS.css' with { type: 'css' }
import { importTemplate } from '../../lib/importTemplate.js';

const TEMPLATE = {
    id: 'loginFormTemplate',
    url: './java/components/LoginForm/LoginForm.html'
}

  // Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 * Login Form Web Component
 * @class LoginForm
 * @emits 'login-form-submit'
 */

export class LoginForm extends HTMLElement {
    static observedAttributes = ['prueba'];
    
    get prueba() {
        return this.getAttribute('prueba');
    }

    get template(){
        return document.getElementById(TEMPLATE.id);
    }

    constructor() {
        super();    
    }
    //Funcionalidad del formulario login
    async connectedCallback() {
        console.log("Custom element added to page.");
        this.attachShadow({ mode:"open" })
        this.shadowRoot.adoptedStyleSheets.push(LoginFormCSS,appCss);

        this._setUpContent()
        // Add event listeners to form elements
        const form = this.shadowRoot.getElementById("loginForm");
        form.addEventListener("submit", this._onFormSubmit.bind(this));
    }
    
    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }
    
    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`,oldValue,newValue);
        this._setUpContent();
    }

     // ======================= Private Methods ======================= //

      /**
   * Private method to set up the content of the web component.
   *
   * Only render if the web component is connected and the template is loaded.
   * Replace any previous content with the template content.
   * @private
   */
    _setUpContent() {
        if (this.shadowRoot && this.template) {
            // Replace previous content
            this.shadowRoot.innerHTML = '';
            this.shadowRoot.appendChild(this.template.content.cloneNode(true));
      }
    }

    /**
     * Handles the form submission event for the login form.
     * Prevents the default form submission behavior and gathers
     * the user's email and password input values. If both fields
     * are filled, sends a POST request to the login API endpoint
     * with the login data. Dispatches a custom event with the API
     * response data if the login is successful, otherwise dispatches
     * an event with null detail.
     *
     * @param {Event} e - The form submission event.
     * @private
     */
    
    async _onFormSubmit(e) {
        e.preventDefault()
        const email = this.shadowRoot.getElementById("email");
        const password = this.shadowRoot.getElementById("password");
        const loginData = {
            email: getInputValue(email),
            password: getInputValue(password)
          }
          let onFormSubmitEvent
          console.log(`DESDE DENTRO DEL COMPONENTE Email: ${loginData.email}, Password: ${loginData.password}`);

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
customElements.define('login-form', LoginForm)
