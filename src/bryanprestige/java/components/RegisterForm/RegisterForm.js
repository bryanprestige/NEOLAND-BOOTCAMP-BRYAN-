import {getAPIData, getInputValue, PORT,navigateTo} from "../../dancingEvents.js"
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import { importTemplate } from '../../lib/importTemplate.js';

const TEMPLATE = {
    id: 'registerFormTemplate',
    url: './java/components/RegisterForm/RegisterForm.html'
}

// Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 *Register Form Web Component
 * @class RegisterForm
 * @emits 'create-user'
 */

export class RegisterForm extends HTMLElement {
    static observedAttributes = ['prueba'];
    
    get prueba() {
        return this.getAttribute('prueba');
    }

    get template(){
        return document.getElementById(TEMPLATE.id);
    }
    constructor(){
        super();
    }
    //FUNCIONALIDAD DEL FORMULARIO DE REGISTRO
    connectedCallback() {
        console.log("Custom element added to page.");
        this.attachShadow({ mode:"open" })
        this.shadowRoot.adoptedStyleSheets.push(css);
        this._setUpContent()
        
        // Add event listeners to form elements
        
        const form = this.shadowRoot.getElementById("registerForm");
        form.addEventListener("submit", this._onRegisterFormSubmit.bind(this));
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }
    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`,oldValue,newValue);
    }
    //==========PRIVATE METHODS============//
    _setUpContent() {
        if (this.shadowRoot && this.template) {
            // Replace previous content
            this.shadowRoot.innerHTML = '';
            this.shadowRoot.appendChild(this.template.content.cloneNode(true));
            
            this.shadowRoot.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', this._validateRegister);
            })
        }
    }

    _onRegisterFormSubmit (e) {
        e.preventDefault()
        if (this._validateRegister() === false) {
            console.log("Paso por aqui");
            alert("Please ensure all fields are correctly filled before submitting.");
            return; 
        } else{
            this._createUser()
            alert('User registered successfully')
                navigateTo('./login.html')
        }
    }
    _validateRegister() {
        let formIsValid = false;
        const email = this.shadowRoot.getElementById("input-email-register")
        const nickname = this.shadowRoot.getElementById("input-nickname-register")
        const name = this.shadowRoot.getElementById("input-name-register")
        const rol = this.shadowRoot.getElementById("input-rol-register")
        const password = this.shadowRoot.getElementById("input-password-register")

        const registerButton = this.shadowRoot.getElementById('register-button-register');

        const fields = [email, nickname, name, rol, password];
        formIsValid = fields.every(field => field?.value.trim() !== '');
        if (!formIsValid) {
        registerButton.disabled = true;
        registerButton.style.backgroundColor = 'grey';
        } else {
        registerButton.disabled = false;
        registerButton.style.backgroundColor = '#243D4B';
        }
        const fieldsEmpty = [
        'input-email-register',
        'input-nickname-register',
        'input-name-register',
        'input-rol-register',
        'input-password-register',
        ].map(id => this.shadowRoot.getElementById(id));
        formIsValid = fieldsEmpty.every(fieldsEmpty => {
        if (fieldsEmpty?.value.trim() === '') {
            fieldsEmpty?.classList.add('invalid-field');
            return false;
        } else {
            fieldsEmpty?.classList.remove('invalid-field');
            return true;
        }
        });
        return formIsValid
    }
    async _createUser() {
        const email = this.shadowRoot.getElementById("input-email-register")
        const nickname = this.shadowRoot.getElementById("input-nickname-register")
        const name = this.shadowRoot.getElementById("input-name-register")
        const rol = this.shadowRoot.getElementById("input-rol-register")
        const password = this.shadowRoot.getElementById("input-password-register")

        let user = {
            email: getInputValue(email),
            nickname: getInputValue(nickname),
            name: getInputValue(name),
            rol: getInputValue(rol),    
            password: getInputValue(password),
        }
        //let onFormCreateUser 
        console.log(`DESDE DENTRO DEL COMPONENTE Email: ${user.email}, Nickname: ${user.nickname}`);
        
        const payload = JSON.stringify(user)
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/create/users?`, 'POST',payload);
        console.log(apiData)

        }
}

customElements.define ('register-form', RegisterForm)
