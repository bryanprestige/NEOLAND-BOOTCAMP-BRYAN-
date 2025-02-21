
import { getInputValue,getUserId,createEventCardWithAnimation,createPreviewContainer,hideCreateEvents} from "../../dancingEvents.js"
import appCss from '../../../css/app.css' with { type: 'css' }
import CreateEventFormCSS from './CreateEventFormCSS.css' with { type: 'css' }
import { importTemplate } from '../../lib/importTemplate.js';

const TEMPLATE = {
    id: 'createEventFormTemplate',
    url: './java/components/CreateEventForm/CreateEventForm.html'
}

  // Wait for template to load
await importTemplate(TEMPLATE.url);
let newEventList = []
/**
 * Create Event Form Web Component
 * @class CreateEventForm
 * @emits 'new-event'
 */

export class CreateEventForm extends HTMLElement {
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
    //Funcionalidad del formulario create Event

    async connectedCallback() {
        console.log("Custom element added to page.");
        this.attachShadow({ mode:"open" })
        this.shadowRoot.adoptedStyleSheets.push(CreateEventFormCSS,appCss);

        this._setUpContent()

        // Add event listeners to form elements
        const form = this.shadowRoot.getElementById("eventForm");
        form.addEventListener("submit", this._onCreateEventFormSubmit.bind(this));
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
   * Only render if the web component is connected and the template is loaded.
   * Replace any previous content with the template content.
   * @private
   */

   _setUpContent() {
      if (this.shadowRoot && this.template) {
        // Replace previous content
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
       
        const submitbutton = this.shadowRoot.getElementById('submit-button')
        submitbutton.addEventListener("click", this._onCreateEventFormSubmit.bind(this));
      }
  }

  _onCreateEventFormSubmit (e) {
    e.preventDefault()
    const newTitleEvent = document.getElementById('main-title-event');
    newTitleEvent.innerText = 'Have a look at your new event, check it out before pusblishing or edit it if you need!';
    
    if (this._validateForm() === false) {
      alert("Please ensure all fields are correctly filled before submitting.");
      return; 
    }else {
      this._createNewEvent()  
      hideCreateEvents()
      console.log(this._createNewEvent())
    }
  } 
  _validateForm() {
    let formIsValid = false;
  
    const fields = [
      'input-event-name',
      'input-venue',
      'input-date',
      'input-time',
      'input-price',
      'input-currency',
      'input-music-ratio',
      'input-city',
      'input-country',
      'input-dance',
  ].map(id => this.shadowRoot.getElementById(id));

    formIsValid = fields.every(field => field?.value.trim() !== '');
   
    console.log('form is valid',formIsValid); 
      
    const fieldsEmpty = [
        'input-event-name',
        'input-venue',
        'input-date',
        'input-time',
        'input-price',
        'input-currency',
        'input-music-ratio',
        'input-city',
        'input-country',
        'input-dance',
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

  async _createNewEvent () {
      const timestamp = new Date()
      //const flyer = document.getElementById('subtmit-flyer')
      const name = this.shadowRoot.getElementById('input-event-name')
      const venue = this.shadowRoot.getElementById('input-venue')    
      const dateTime = this.shadowRoot.getElementById('input-dateTime')
      const price = this.shadowRoot.getElementById('input-price')
      const currency = this.shadowRoot.getElementById('input-currency')
      const music = this.shadowRoot.getElementById('input-music-ratio')
      const country = this.shadowRoot.getElementById('input-country')
      const city = this.shadowRoot.getElementById('input-city')
      const dance = this.shadowRoot.getElementById('input-dance')
      const url = this.shadowRoot.getElementById('input-url')
      const eventContainer =  document.querySelector('.event-container');

      const userId = getUserId()
      const event_id = String(timestamp.getTime())
  
      /**
       * @type {Event}
       */
      let event = {
          //flyer: getInputValue(flyer),
          name: getInputValue(name),
          venue: getInputValue(venue),
          dateTime: getInputValue(dateTime),
          price: getInputValue(price),
          currency: getInputValue(currency),
          music: getInputValue(music),
          city: getInputValue(city),
          country: getInputValue(country),
          dance: getInputValue(dance),
          url: getInputValue(url),
          user_id: userId,
          event_id: event_id
      }
      
      console.log('new event list',newEventList)  
      
      newEventList.push(event)
      this._saveNewEventToLocalStorage(newEventList)
      console.log('neweventlist',newEventList)
      createEventCardWithAnimation(event, eventContainer)
      console.log('he creado el evento desde el componente createeventcard')
      createPreviewContainer()
 
  }

  _saveNewEventToLocalStorage (newEventList) {
    localStorage.setItem('newEventList', JSON.stringify(newEventList));
  }
}
console.log('por aqui he pasado')
customElements.define('create-event-form', CreateEventForm)