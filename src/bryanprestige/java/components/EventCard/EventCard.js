import appCss from '../../../css/app.css' with { type: 'css' }
import EventCardCSS from './EventCardCSS.css' with { type: 'css' }
import { importTemplate } from '../../lib/importTemplate.js';

//import {getAPIData, getInputValue, PORT} from "../../dancingEvents.js"

const TEMPLATE = {
    id: 'eventCardTemplate',
    url: './java/components/EventCard/EventCard.html'
}

  // Wait for template to load
await importTemplate(TEMPLATE.url);

/**
 * Login Form Web Component
 * @class CreateEvent
 * @emits 'create-event'
 */

export class CreateEvent extends HTMLElement {
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
    //funcionalidad de la creacion del evento
    connectedCallback() {
        console.log("Custom element added to page.");
        this.attachShadow({ mode:"open" })
        this.shadowRoot.adoptedStyleSheets.push(EventCardCSS,appCss);

        this._setUpContent()
        // Add event listeners to form elements
        const form = this.shadowRoot.getElementsByClassName("event-card");
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
    ///////////PRIVATE METHODS
    _setUpContent() {
        if (this.shadowRoot && this.template) {
        // Replace previous content
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        }   

        
    }
}