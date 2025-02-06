
/*
// @ts-check
*/
import {INITIAL_STATE,store} from '../storeRedux/redux.js'
import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './classes/HttpError.js'
/**
 * @import {Event} from './classes/Event.js'
 * @import {User}   from './classes/User.js'
 */



const PORT = 1337

let basketCount = 0;    

let eventList = []
let totalPriceValue = 0;
let userList = []
let newEventList = []

document.addEventListener('DOMContentLoaded', () => {

    if (window.location.pathname.includes('profile.html')) {
        
        const submitButton = document.getElementById('submit-button')
        submitButton?.addEventListener('click',onClickSubmitButton)   
        
        /*
        const editEventProfile = document.getElementById('edit-event-button')
        editEventProfile?.addEventListener('click',displayEditForm)
        */
       const favoriteButtonProfile = document.getElementById('fav-button-profile') 
       favoriteButtonProfile?.addEventListener('click',displayFavoriteEvents)
       displayBasketCount() 

        document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateForm);
        })
    }
    else if (window.location.pathname.includes('login.html')) {
    
    const loginForm = document.getElementById('login-container')
    loginForm?.addEventListener('submit', onLoginFormSubmit)
    }
    else if (window.location.pathname.includes('register.html')) {
        const registerButton =document.getElementById('register-button-register')
        registerButton?.addEventListener('click',onClickRegisterButton)

        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', validateRegister);
            })
    }
    else if (window.location.pathname.includes('basket.html')) {
        const checkoutButtonContainer = document.getElementById('checkout-button-container')
        checkoutButtonContainer.textContent = `Total: $${totalPriceValue}`
    }
    /*else if (window.location.pathname.includes('login.htm')) {
        const submitButtonLogin =document.getElementByClassName('submit-button-login')
        submitButtonLogin?.addEventListener('click',onClickSubmitButtonLogin)
    }*/
     
    else if (window.location.pathname.includes('dancingEvents.html')) {
        updateDefaultFeed()
        const searchButton = document.getElementById('search-button');
        hideShowSearchButton()
        // Evento de clic para el botón de búsqueda
        searchButton?.addEventListener('click', onSearchClick);
        // Delegación de eventos para botones dinámicos (tipo de baile y ciudad)
        const eventContainer = document.querySelector('.event-container');
        eventContainer?.addEventListener('click', onFilterButtonClick);

        const favoriteButton = document.getElementById('favorite-button');
        favoriteButton?.addEventListener('click', displayFavoriteEvents);        
    }
    checkLoginStatus()
});

/*TO DO: MAKE BASKET COUNT APPEAR IN EVERY PAGE*/   


/**
 * @param {MouseEvent} event
 */

async function onSearchClick(event) {
    event.preventDefault();
    
    const searchField = document.getElementById('search-field').value.trim().toLowerCase();
    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/filter/events/${searchField}`);

    const eventContainer = document.querySelector('.event-container');

    if (apiData.length === 0) { 
        noEventFound()
    } else {
        cleanEventContainer()
        apiData.forEach(event => createEventCardWithAnimation(event,eventContainer));
    }
    loadBasketFromLocalStorage()  
    scrollToTop();
}

/**
 * @param {MouseEvent} e
 */

function onClickSubmitButton(e) {
    e.preventDefault()

    if (validateForm() === false) {
        alert("Please ensure all fields are correctly filled before submitting.");
        return; 
    }else {
     cleanEventContainer()   
     createNewEvent()
     hideForm()
    }
}
/**
 * @param {MouseEvent} event
 */
async function onFilterButtonClick(e) {
    e.preventDefault();
    const target = e.target;
    const filterValue = target?.textContent?.toLowerCase();  
    
    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/filter/events/${filterValue}`);
    
    if (!(target instanceof HTMLButtonElement) ||
        target.classList.contains('remove-button') ||
        target.classList.contains('favorite-button') ||
        target.classList.contains('buy-button')) 
        return;
    if (!apiData) return;
    const eventContainer = document.querySelector('.event-container');
    if (!eventContainer) return;
    cleanEventContainer();

    apiData.forEach(e => {
        createEventCardWithAnimation(e, eventContainer);
    })
   
    const basketElement = document.querySelector('.basket-counter');
    const storedBasketCount = localStorage.getItem('basketCount') || 0;
    basketElement.innerText = `BASKET (${storedBasketCount})`;
    scrollToTop();   
}
/**
 * @param {MouseEvent} event
 */

function onClickRegisterButton (e) {
    e.preventDefault()
    if (validateRegister() === false) {
        alert("Please ensure all fields are correctly filled before submitting.");
        return; 
    } else{
        
    createUser ()
    }
    saveUserListToLocalStorage(userList)
    //sendToLogin()
    alert('User registered successfully')
    navigateTo('./login.html')
}

function navigateTo(pathname) {
    const newLocation = {
      ...window.location.href = pathname,
    }
    window.history.pushState({}, '', pathname)
    const newLocationLinked = location.pathname.replace(/\/src/, '')
    console.log(newLocation)
    console.log(newLocationLinked)
  }

async function createUser () {
        const email = document.getElementById('input-email-register')
        const nickname = document.getElementById('input-nickname-register')
        const name = document.getElementById('input-name-register')
        const rol = document.getElementById('input-rol-register')
        const password = document.getElementById('input-password-register')
    
    /**
     * @type {User}
     */
    let user = {
        email: getInputValue(email),
        nickname: getInputValue(nickname),
        name: getInputValue(name),
        rol: getInputValue(rol),    
        password: getInputValue(password),
    }
    const payload = JSON.stringify(user)

    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/create/users?`, 'POST',payload);
    console.log(apiData)

    userList.push(user)
}

async function createNewEvent () {
    //const flyer = document.getElementById('subtmit-flyer')
    const name = document.getElementById('input-event-name')
    const address = document.getElementById('input-address')
    const dateTime = document.getElementById('input-dateTime')
    const price = document.getElementById('input-price')
    const currency = document.getElementById('input-currency')
    const music = document.getElementById('input-music-ratio')
    const city = document.getElementById('input-city')
    const dance = document.getElementById('input-dance')
    const eventContainer = document.querySelector('.event-container');
    
    /**
     * @type {Event}
     */
    let event = {
        //flyer: getInputValue(flyer),
        name: getInputValue(name),
        address: getInputValue(address),
        dateTime: getInputValue(dateTime),
        price: getInputValue(price),
        currency: getInputValue(currency),
        music: getInputValue(music),
        city: getInputValue(city),
        dance: getInputValue(dance),
    }
    const payload = JSON.stringify(event)

    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/create/events?`,'POST',payload);
    console.log(apiData)
    
    newEventList.push(event)
    saveNewEventToLocalStorage(newEventList)
    createEventCardWithAnimation(event, eventContainer)
    hideForm()
}

//function displayboughtEvents () {



function displayFavoriteEvents(event) {
    event.preventDefault(); 
    const eventContainer = document.querySelector('.event-container');
    let favList = JSON.parse(localStorage.getItem('favList')) || [];

    if (favList.length === 0) {
        noEventFound()
     } else {
        cleanEventContainer() 
         // Mostrar solo los eventos favoritos
         favList.forEach(event => {
             createEventCardWithAnimation(event, eventContainer);
         });
     }
     const previewContainer = document.querySelector('.preview-container');
     if (previewContainer) {
       previewContainer.remove();
    }
}

async function updateDefaultFeed() {
    
    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/read/events?`,'GET');

    const eventContainer = document.querySelector('.event-container');
    cleanEventContainer()
    apiData.forEach(event => {
        createEventCardWithAnimation(event, eventContainer);
        setLocalStorageFromState(this, 'eventStorage')
    });
}
/**
 * @param {Event} event 
 * @param {HTMLElement} container
 */ 
function createEventCardWithAnimation(event, container)     {
    const card = createEventCardElement(event); 
    card.classList.add('zoom-in'); 
    
    card.addEventListener('animationend', () => {
        card.classList.remove('zoom-in');
    });
    
    container.appendChild(card);
    loadBasketFromLocalStorage()
}
/**
 * 
 * @param {Event} event 
 */ 
function createEventCardElement(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.ticketCount = 0;   

    const leftColumn = createLeftColumn(event, card);
    const rightColumn = createRightColumn(event);

    card.appendChild(leftColumn);
    card.appendChild(rightColumn);

    createPreviewContainer()   

    eventList.push(card)
    return card;
}
/**
 * 
 * @param {MouseEvent} event 
 * @param {HTMLElement} card
 */ 
function createLeftColumn(event, card) {
    const leftColumn = document.createElement('div');
    leftColumn.className = 'left-column';
    
    const image = createImageElement(event.name);
    const nameFav = createNameFavElement(event);
    const address = createElementWithText('h1', 'address', event.address);
    const buyButton = createBuyButton(card, event);
    
    leftColumn.append(image, nameFav, address, buyButton);
    
    return leftColumn;
}
/**
 * 
 * @param {MouseEvent} event 
 */ 

function createRightColumn(event) {
    const rightColumn = document.createElement('div');
    rightColumn.className = 'right-column';
    
    const reviews = createElementWithText('div', 'reviews-placeholder', 'Reviews Placeholder');
    const priceCurrency = createPriceCurrencyElement(event);
    const date = createElementWithText('h1', 'date-time', event.dateTime);
    const musicRatio = createMusicRatioElement(event.music);
    const typeCity = createTypeCityElement(event);
    
    rightColumn.append(reviews, priceCurrency, date, musicRatio, typeCity);
    
    return rightColumn;
}
function createPreviewContainer() {
    if (window.location.pathname.includes('profile.html')) {
        let previewContainer = document.querySelector('.preview-container'); 
        if (!previewContainer) {
        const previewContainer = document.createElement('div')
        previewContainer.className = 'preview-container'
   
        const previewTitle = document.createElement('h1');
        previewTitle.className = 'preview-title';
        previewTitle.innerText = 'YOUR EVENT PREVIEW'; 

        const publishButton = document.createElement('button')
        publishButton.className = 'publish-button'
        publishButton.innerText = 'PUBLISH'
        
        const editButton = document.createElement('button')
        editButton.className = 'edit-event-button'
        editButton.innerText = 'EDIT'

        previewContainer.append(previewTitle,publishButton,editButton);
        document.body.appendChild(previewContainer);
    }
    return previewContainer
}}
/**
 * 
 * @param {string} eventName 
 */ 
function createImageElement(eventName) {
    const image = document.createElement('img');
    image.className = 'event-image';
    image.src = './imagenes/placehold400x200.png';
    image.alt = `${eventName} image`;
    return image;
}
/**
 * 
 * @param {object} event 
 */ 
function createNameFavElement(event) {
    const nameFav = document.createElement('div');
    nameFav.className = 'name-fav';

    const name = createElementWithText('h1', 'name', event.name);
    const favButton = createFavButton(event);

    nameFav.append(name, favButton);
    return nameFav;
} 
/**
 * 
 * @param {object} event 
 */ 

function createFavButton(event) {
    const favButton = document.createElement('button');
    favButton.className = 'fav-button';
    favButton.innerHTML = '<img src="./imagenes/fav.png">';

    const favList = JSON.parse(localStorage.getItem('favList')) || [];
    if (favList.some(favEvent => favEvent.name === event.name)) {
        favButton.classList.add('favorited');
    }

    favButton.addEventListener('click', () => toggleFavorite(event, favButton));
    return favButton;
}
/**
 * 
 * @param {object} card
 * @param {object} event 
 */ 
function createBuyButton(card, event) {
    const buyButton = document.createElement('button');
    buyButton.className = 'buy-button';
    buyButton.innerHTML = '<img src="./imagenes/shop.png" alt="shop" id="shop-img">';


    const basketElement = document.querySelector('.basket-counter');
    buyButton.addEventListener('click', () => handleBuyButtonClick(card, event, basketElement));

    return buyButton;
}
/**
 * @param {object} card
 * @param {object} event
 * @param {HTMLElement | null} basketElement
 */ 
function handleBuyButtonClick(card, event, basketElement) {
    sumPriceValue(card)    

    card.ticketCount++;
    let ticketCountSpan = card.querySelector('.ticket-count');

    if (!ticketCountSpan) {
        ticketCountSpan = createElementWithText('span', 'ticket-count', `(${card.ticketCount})`);
        const leftColumn = card.querySelector('.left-column');
        leftColumn.appendChild(ticketCountSpan);
    } else {
        ticketCountSpan.textContent = `(${card.ticketCount})`;
    }

    ticketCountSpan.style.display = 'inline';
 
    let removeButton = card.querySelector('.remove-button'); 
    if (!removeButton) {
        removeButton = createRemoveButton(card, event, basketElement, ticketCountSpan);
        const leftColumn = card.querySelector('.left-column');
        leftColumn.appendChild(removeButton);
    } 
    updateTicketCount(event, card.ticketCount);
    updateBasketCounter(basketElement);
    saveBasketToLocalStorage(); // Guardar cambios
}
/**
 * @param {object} card
 * @param {object} event
 * @param {HTMLElement | null} basketElement
 * @param {HTMLElement | null} ticketCountSpan 
 */ 
function createRemoveButton(card, event, basketElement, ticketCountSpan) {
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remove';

    removeButton.addEventListener('click', (e) => {
        resPricevalue(card)
        e.stopPropagation();
        card.ticketCount--;

        ticketCountSpan.textContent = `(${card.ticketCount})`;
        if (card.ticketCount === 0) {
            ticketCountSpan.style.display = 'none';
            removeButton.remove();
        }

        updateTicketCount(event, card.ticketCount);
        updateBasketCounter(basketElement);
        saveBasketToLocalStorage(); // Guardar cambios
    });

    return removeButton;
}
/**
 * 
 * @param {object} event 
 */ 
function createPriceCurrencyElement(event) {
    const priceCurrency = document.createElement('div');
    priceCurrency.className = 'price-currency';

    const currency = createElementWithText('currency', 'currencly', event.currency);
    currency.setAttribute('select', event.currency);
    const price = createElementWithText('h1', 'price', event.price);

    priceCurrency.append(currency, price);
    return priceCurrency
}

/**
 * 
 * @param {string} music
 */ 
function createMusicRatioElement(music) {
    const musicRatio = createElementWithText('h1', 'music-ratio', music);

    if (music.includes("100%")) {
        musicRatio.classList.add('single-style');
    } else {
        const ratios = music.split(",");
        musicRatio.classList.add(ratios.length === 2 ? 'two-styles' : 'three-styles');
    }

    return musicRatio;
}

/**
 * 
 * @param {object} event
 */
function createTypeCityElement(event) {
    const typeCity = document.createElement('div');
    typeCity.className = 'type-city';

    const buttonType = createButtonWithStyle('button-dance-type', event.dance, getDanceTypeColor(event.dance));
    const buttonCity = createElementWithText('button', 'button-city', event.city);

    typeCity.append(buttonType, buttonCity);
    return typeCity;
}
/**
 * @param {string} className
 * @param {string} textContent
 * @param {string} backgroundColor
 */ 
function createButtonWithStyle(className, textContent, backgroundColor) {
    const button = createElementWithText('button', className, textContent);
    button.style.backgroundColor = backgroundColor;
    return button;
}
/**
 * @param {string} dance
 */ 

function getDanceTypeColor(dance) {
    switch(dance.toLowerCase()) {
        case 'bachata': return 'lightgreen';
        case 'salsa': return 'lightyellow';
        case 'tango': return '#FF5733';
        case 'zouk': return '#33C4FF';
        case 'west coast swing': return '#FFC300';
        case 'kizomba': return '#fb8500';
        case 'sbk': return '#ff006e';
        default: return 'white';
    }
}
/**
 * @param {string} tag
 * @param {string} className
 * @param {string} textContent
 */ 

function createElementWithText(tag, className, textContent) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
}
/**
 * @param {object} event
 * @param {HTMLElement | null} button
 */ 

function toggleFavorite(event, button) {
    let favList = JSON.parse(localStorage.getItem('favList')) || []; // Obtener la lista de favoritos
    const index = favList.findIndex(favEvent => favEvent.name === event.name);
    //VERIFY IF THE EVENT IS ALREADY IN FAVORITES
    if (index === -1) {
        favList.push(event);
        button.classList.add('favorited'); 
    } else {
        favList.splice(index, 1);
        button.classList.remove('favorited');
    }

    // SAVE THE UPDATED FAVORITE LIST TO LOCAL STORAGE
    localStorage.setItem('favList', JSON.stringify(favList));
}
/**
 * @param {object} event
 * @param {number} ticketCount
 */ 

function updateTicketCount(event, ticketCount) {
    let ticketList = JSON.parse(localStorage.getItem('ticketList')) || [];
    const eventIndex = ticketList.findIndex(item => item.name === event.name);
    //UPDATE TICKET COUNT
    if (eventIndex === -1) {
        ticketList.push({ name: event.name, count: ticketCount });
    } else {
        ticketList[eventIndex].count = ticketCount;
    }
    //ADD TICKETS TO LOCALSTORAGE
    localStorage.setItem('ticketList', JSON.stringify(ticketList));
}
/**
 * Actualiza el contador de tickets en el elemento de la cesta.
 * @param {HTMLElement | null} basketElement 
 */
function updateBasketCounter(basketElement) {
    basketCount = 0; 
    const events = document.querySelectorAll('.event-card')
    //UPDATE TICKET COUNT
    events.forEach((event) => {
    basketCount += event.ticketCount    
    localStorage.setItem('basketCount', basketCount)        
    })
    
    //BASKET COUNTER
    basketElement.textContent = `BASKET (${basketCount})`
    if(basketCount === 0) {
     basketElement.innerText = "BASKET"
}}

function saveBasketToLocalStorage() {
    const eventCards = document.querySelectorAll('.event-card');
    const basketData = [];

    eventCards.forEach(card => {
        const eventName = card.querySelector('.name').textContent;
        const ticketCount = card.ticketCount || 0;

        if (ticketCount > 0) {
            basketData.push({ name: eventName, ticketCount });
        }
    });

    localStorage.setItem('basket', JSON.stringify(basketData));
}

function loadBasketFromLocalStorage() {
    const basketData = JSON.parse(localStorage.getItem('basket')) || [];
    const basketElement = document.querySelector('.basket-counter');

    basketData.forEach(savedEvent => {
        const eventCards = document.querySelectorAll('.event-card');

        eventCards.forEach(card => {
            const eventName = card.querySelector('.name').textContent;

            if (eventName === savedEvent.name) {
                card.ticketCount = savedEvent.ticketCount;

                let ticketCountSpan = card.querySelector('.ticket-count');
                if (!ticketCountSpan) {
                    ticketCountSpan = createElementWithText('span', 'ticket-count', `(${card.ticketCount})`);
                    const leftColumn = card.querySelector('.left-column');
                    leftColumn.appendChild(ticketCountSpan);
                } else {
                    ticketCountSpan.textContent = `(${card.ticketCount})`;
                }

                ticketCountSpan.style.display = 'inline';

                let removeButton = card.querySelector('.remove-button');
                if (!removeButton) {
                    removeButton = createRemoveButton(card, { name: eventName }, basketElement, ticketCountSpan);
                    const leftColumn = card.querySelector('.left-column');
                    leftColumn.appendChild(removeButton);
                } 
            }
        });
    });
    updateBasketCounter(basketElement);
}

function setLocalStorageFromState(key = 'eventStorage') {
    const storeData = store.getState()
    //delete storeData.user
    updateLocalStorage(storeData, key)
}
/**
 * @param{State} storeValue
 */

function updateLocalStorage(storeValue, key = 'eventStorage') {
    localStorage.setItem(key, JSON.stringify(storeValue));
}
/**
 * 
 * @param {HTMLElement | null} card
 */
function getPriceValue(card) {
    const priceElement = card.querySelector('.price');
    const priceValue = priceElement.textContent.replace('$', '');
    return priceValue;
}
/**
 * 
 * @param {HTMLElement | null} card
 */
function sumPriceValue(card)  {
    const priceValue = getPriceValue(card);
    console.log(`Event price: ${priceValue}`);

    totalPriceValue += parseInt(priceValue);
    localStorage.setItem('totalPriceValue', JSON.stringify(totalPriceValue));
}
/**
 * 
 * @param {HTMLElement | null} card
 */

function resPricevalue(card) {
    const priceValue = getPriceValue(card);
    totalPriceValue -= parseInt(priceValue);

    localStorage.setItem('totalPriceValue', JSON.stringify(totalPriceValue));
}

async function getAPIData(apiURL = 'api/get.events.json', method = 'GET' , data) {
    let apiData
  
    try {
        let headers = new Headers()

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }
        apiData = await simpleFetch(apiURL, {
          // Si la petición tarda demasiado, la abortamos
          signal: AbortSignal.timeout(3000),
          method: method,
          body: data ?? undefined,
          headers: headers
        });
      } catch (/** @type {any | HttpError} */err) {
      if (err.name === 'AbortError') {
        //console.error('Fetch abortado');
      }
      if (err instanceof HttpError) {
        if (err.response.status === 404) {
          //console.error('Not found');
        }
        if (err.response.status === 500) {
          //console.error('Internal server error');
        }
      }
    }
    return apiData
  }

  function scrollToTop() {
    const scrollList = document.querySelector('.event-container');
    if (scrollList) {
        scrollList.scrollTop = 0;
    }
}
function noEventFound () {
    cleanEventContainer()
    const eventContainer = document.querySelector('.event-container');
    const errorImg = document.createElement('img');
    errorImg.className = 'error-img';
    errorImg.src = './imagenes/noEvent.png';
    
    eventContainer.appendChild(errorImg);
}
/**
 * 
 * @param {HTMLElement | null} inputElement
 */

function getInputValue(inputElement) {
    if (inputElement) {
      return /** @type {HTMLInputElement} */(inputElement).value
    } else {
      return ''
    }
}

function hideForm () {
    let form = document.getElementById('event-creator');
    if (eventList.length === 1) {
        form.style.display = 'none';
       }
}

function validateForm() {
    let formIsValid = false;
    const name = document.getElementById('input-event-name');
    const address = document.getElementById('input-address');
    const date = document.getElementById('input-date');
    const time = document.getElementById('input-time');
    const price = document.getElementById('input-price');
    const currency = document.getElementById('input-currency');
    const music = document.getElementById('input-music-ratio');
    const city = document.getElementById('input-city');
    const dance = document.getElementById('input-dance');
  
    const submitButton = document.getElementById('submit-button');

    const fields = [name, address, date, time, price, currency, music, city, dance];
    formIsValid = fields.every(field => field?.value.trim() !== '');

    submitButton.disabled = !formIsValid;

    const fieldsEmpty = [
        'input-event-name',
        'input-address',
        'input-date',
        'input-time',
        'input-price',
        'input-currency',
        'input-music-ratio',
        'input-city',
        'input-dance',
    ].map(id => document.getElementById(id));

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
function hideShowSearchButton() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('event-name');  
    // Desactivar el botón inicialmente si el input está vacío
    if (searchInput?.value.trim() === '') {
          searchButton.disabled = true;
    }
    // Evento para habilitar/deshabilitar el botón según el contenido del input
    searchInput?.addEventListener('input', () => {
          const isInputValid = searchInput.value.trim() !== '';
          searchButton.disabled = !isInputValid; // Habilitar o deshabilitar el botón
    });
}

function cleanEventContainer() {
    const eventContainer = document.querySelector('.event-container');
    while (eventContainer.firstChild) {
        eventContainer.removeChild(eventContainer.firstChild);
    }
}

function validateRegister() {
    let formIsValid = false;
        const email = document.getElementById('input-email-register')
        const nickname = document.getElementById('input-nickname-register')
        const name = document.getElementById('input-name-register')
        const rol = document.getElementById('input-rol-register')
        const password = document.getElementById('input-password-register')
  
    const registerButton = document.getElementById('register-button-register');

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
    ].map(id => document.getElementById(id));

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
function saveNewEventToLocalStorage (newEventList) {
    localStorage.setItem('newEventList', JSON.stringify(newEventList));
}

function displayBasketCount () {
    //const basketData = JSON.parse(localStorage.getItem('basket')) || [];
    const basketElement = document.querySelector('.basket-counter');
    basketElement.textContent = `BASKET (${basketCount})`
    if(basketCount === 0) {
     basketElement.innerText = "BASKET"
    }
    updateBasketCounter(basketElement)
}


async function onLoginFormSubmit(e){
    const emailElement = document.getElementById('email')
    const passwordElement = document.getElementById('password')
    const loginData = {
      email: getInputValue(emailElement),
      password: getInputValue(passwordElement)
    }
  
    e.preventDefault()
  
    if (loginData.email !== '' && loginData.password !== '') {
      const apiData = await getAPIData(`http://${location.hostname}:${PORT}/read/users?`,'GET');

      let userData = apiData.find((itemData) => {
        const user = /** @type {User} */(itemData)
  
        return user.email === loginData.email && user.password === loginData.password
      })
  
      if (!userData) {
        // Show error
        alert('El usuario no existe')
      } else {
        const storeUserData = /** @type {User} */(userData)
        delete storeUserData.password
        // Login user
        store.user.login(storeUserData, setSessionStorageFromStore)
        // Redirect to home
      }
    }
  }

function saveUserListToLocalStorage(userList) {
    localStorage.setItem('userList', JSON.stringify(userList));
}

function updateSessionStorage(storeValue) {
    sessionStorage.setItem('userList', JSON.stringify(storeValue))
  }
/**
 * Saves the current state of the store in local storage.
 * Removes the user's data from the store before saving.
 */
function setLocalStorageFromStore() {
    // Remove user data from store before saving
    const storeState = store.getState()
    delete storeState.user
    updateLocalStorage(storeState)
  }

/**
 * Saves the current state of the store in session storage.
 * Removes all data except the user data from the store before saving.
 */

function setSessionStorageFromStore() {
    // Remove unused data from store before saving
    const storeState = store.getState()
    delete storeState.articles
    delete storeState.error
    delete storeState.isLoading
    delete storeState.route
    updateSessionStorage(storeState)
  }

 /**
 * Retrieves the shopping list data from session storage.
 *
 * @returns {State} Saved state.
 * If no data is found, returns an empty State object.
 */

function getDataFromLocalStorage() {
    const defaultValue = JSON.stringify(INITIAL_STATE)
    return JSON.parse(localStorage.getItem('userList') || defaultValue)
  }

function getDataFromSessionStorage() {
    const defaultValue = JSON.stringify(INITIAL_STATE)
    return JSON.parse(sessionStorage.getItem('userList') || defaultValue)
  }

/**
 * Check user login status
 */
function checkLoginStatus() {
    /** @type {State} */
    const storedData = getDataFromSessionStorage()
    if (storedData?.user?.token) {
      const storeUserData = /** @type {User} */(storedData?.user)
      delete storeUserData.password
      store.user.login(storeUserData)
    }
}

export {
    getDataFromLocalStorage,
    setLocalStorageFromStore
}