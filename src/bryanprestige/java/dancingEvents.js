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

export const PORT = location.port ? `:${location.port}` : ''

let basketCount = 0;    

let eventList = []

let totalPriceValue = 0;

document.addEventListener('DOMContentLoaded', () => {
    
    displayUserNickname()
    showLogoutButton()
    const logOutButton = document.getElementsByClassName('log-out');
    logOutButton[0]?.addEventListener('click', onLogoutClick);

    if (window.location.pathname.includes('profile.html')) {
        displayProfile();
        displayMyEventsPurchased();
    }
    else if (window.location.pathname.includes('login.html')) {
        window.addEventListener('login-form-submit', onLoginComponentSubmit)
    }
    else if (window.location.pathname.includes('register.html')) {
        window.addEventListener('create-user', onRegisterComponentSubmit)
    }
    else if (window.location.pathname.includes('basket.html')) {
        displayEventToBuy ()
        continueToCheckout()
    }
     
    else if (window.location.pathname.includes('index.html')) {
        updateDefaultFeed() 

        const favoriteButton = document.getElementById('favorite-button');
        favoriteButton?.addEventListener('click', displayFavoriteEvents);        
    }
    checkLoginStatus()
});


/*TO DO: CREATE A PAGE JUST FOR WHEN THE EVENTS ARE CLICKED AND JUST DISPLAYIN THAT EVENT*/
/*TO DO: MAKE FOLLOWING BUTTON*/
/*TO DO: DISPLAY FOLLOWERS ON USERS PROFILE */
/*MAKE A CHAT BETWEEN USERS*/
/*EVENT NAME NEEDS TO APPEAR ON THE CHECKOUT FORM*/
/*MY ORDERS SECTION DISPLAYED ON PROFILE COMPONENT*/
/*TO DO: RESTRICT PROFILE AND OPTIONS TO LOGGED IN USERS*/
/*TO DO: FILTRADO POR FECHA, BUSQUEDA DE FECHA EXACTA Y FILTRO ENTRE DOS FECHAS*/
/*TO DO: DISPLAY USERNAME INSTEAD OF "PROFILE" WHEN USER IS LOGGED IN */
/*TO DO: RESTRIC FAV BUTTON TO LOGGED IN USERS*/
/*TO DO: FINISH FIND.HTMLL STYLE AND FUNCTIONALITIES*/
/*TO DO: MAKE FILTER THAT GIVES ME THE EVENTS BOUGHT BY THE USER*/

//====================FEED=====================//

/**
 * @param {MouseEvent} event
 */
export async function onFilterButtonClick(e) {
    e.preventDefault();
    const target = e.target;
    const filterValue = target?.textContent?.toLowerCase();  
    
    const eventContainer = document.querySelector('.event-container');
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/events/${filterValue}`);
  
    if (!apiData) return;
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

async function updateDefaultFeed() {
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/read/events?`,'GET');
    const eventContainer = document.querySelector('.event-container');
    apiData.forEach(event => {
        createEventCardWithAnimation(event, eventContainer);
        setLocalStorageFromState(this, 'eventStorage')
    });
}

/**
 * @param {MouseEvent} event
 */

export function displayFavoriteEvents(event) {
    event.preventDefault(); 
    hideCreateEvents()
    hideEditEvents()
    const eventContainer = document.querySelector('.event-container');
    const userId = getUserId()
    const storageUser = `favList_${userId}`;

    let userFavList = JSON.parse(localStorage.getItem(storageUser)) || [];
  
    if (userFavList.length === 0) {
        noEventFound()
     } else {
        cleanEventContainer() 
         userFavList.forEach(event => {
             createEventCardWithAnimation(event, eventContainer);
         });
     }
    hideEditProfileForm()
    hidePreviewContainer()
    displayBasketCount()
}

/**
 * @param {Event} event 
 * @param {HTMLElement} container
 */ 
export function createEventCardWithAnimation(event, container){
    const card = createEventCardElement(event); 
    card.classList.add('zoom-in'); 
    card.addEventListener('animationend', () => {
        card.classList.remove('zoom-in');
    });

    container.appendChild(card);
    loadBasketFromLocalStorage()
    return card;
}

function displayUserNickname() {
    let profileUsername = document.querySelector('.profile-username')
    if (!isUserLoggedIn()) {
        profileUsername.innerText = `PROFILE`
        return
    } else if(isUserLoggedIn){
        const userNickname = getUserNickname()
        profileUsername.innerText = `${userNickname.toUpperCase()}`
    }
    console.log('paso por el displayUserNickname')
}

function showLogoutButton() {
    let loginButton = document.querySelector('.login-button')
    let registerButton = document.querySelector('.register')
    let logoutButton = document.querySelector('.log-out')
    if (!isUserLoggedIn()) {
        return
    } else if(isUserLoggedIn){
        loginButton.style.display = 'none'
        registerButton.style.display = 'none'
        logoutButton.style.display = 'block'
    }
    console.log('paso por el displayUserNickname')
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
    card.append(leftColumn,rightColumn);

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
    const instagramAnchor = createInstagramAnchor(event);
    const nameFav = createNameFavElement(event);
    const priceCurrency = createPriceCurrencyElement(event);
    const buyButton = createBuyButton(card, event);
    
    leftColumn.append(image,instagramAnchor, nameFav, priceCurrency,buyButton);
    
    return leftColumn;
}

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

function createInstagramAnchor(event) {
    const instagramAnchor = document.createElement('a');
    instagramAnchor.className = 'instagram-anchor';
    instagramAnchor.href = `https://${event.url}`;
    instagramAnchor.innerHTML = '<img src="./imagenes/instagram.png" alt="instagram" class="instagram-img">';
    instagramAnchor.target = '_blank';

    if (!event.url || event.url.trim() === "") {
        instagramAnchor.style.display = 'none';
    }
    return instagramAnchor;
}
/**
 * 
 * @param {Event} event 
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
    
    const userId = getUserId()

    const storageUser = `favList_${userId}`;

    let userFavList = JSON.parse(localStorage.getItem(storageUser)) || [];
    if (userFavList.some(favEvent => favEvent.name === event.name)) {
        favButton.classList.add('favorited');
    }

    favButton.addEventListener('click', () => toggleFavorite(event, favButton));
    return favButton;
}

/**
 * @param {object} event
 * @param {HTMLElement | null} button
 */ 

export function toggleFavorite(event, favButton) { 
    const userId = getUserId()
    const storageUser = `favList_${userId}`;
    let userFavList = JSON.parse(localStorage.getItem(storageUser)) || []; // Obtener la lista de favoritos
    
    const index = userFavList.findIndex(favEvent => favEvent.name === event.name);
    //VERIFY IF THE EVENT IS ALREADY IN FAVORITES
    if (index === -1) {
        userFavList.push(event);
        favButton.classList.add('favorited'); 

    } else {
        userFavList.splice(index, 1);
        favButton.classList.remove('favorited');
    }

    // SAVE THE UPDATED FAVORITE LIST TO LOCAL STORAGE
    localStorage.setItem(storageUser, JSON.stringify(userFavList));
}

/**
 * @param {object} event 
 */ 
function createPriceCurrencyElement(event) {
    const priceCurrency = document.createElement('div');
    priceCurrency.className = 'price-currency';

    const currency = createElementWithText('h1', 'currency', event.currency);
    const price = createElementWithText('h1', 'price', event.price);

    priceCurrency.append(currency, price);
    return priceCurrency
}
/**
 * 
 * @param {object} card
 * @param {object} event 
 */ 
function createBuyButton(card, event) {
    const buyButton = document.createElement('button');
    buyButton.className = 'buy-button';
    buyButton.innerText = 'Buy Tickets'

    buyButton.addEventListener('click', () => onBuyTicketClick(card, event));
    return buyButton;
}

/**
 * @param {object} card
 * @param {object} event
 * @param {HTMLElement | null} basketElement
 */ 
export function onBuyTicketClick(card, event) {
    card.ticketCount++;    
    
    saveBasketToLocalStorage(event); 
    navigateTo('./basket.html')
}

/**
 * 
 * @param {MouseEvent} event 
 */ 

function createRightColumn(event) {
    const rightColumn = document.createElement('div');
    rightColumn.className = 'right-column';
    
    const reviews = createElementWithText('div', 'reviews-placeholder', 'Reviews Placeholder');
    const venue = createElementWithText('h1', 'venue', event.venue);

    const date = createElementWithText('h1', 'date-time', event.dateTime);
    const musicRatio = createMusicRatioElement(event.music);
    const cityCountry = createCityCountryElement(event);
    const dance = createButtonWithStyle('button-dance-type', event.dance, getDanceTypeColor(event.dance));
    dance.addEventListener('click', onFilterButtonClick);

    rightColumn.append(reviews,venue, date, musicRatio, cityCountry,dance);
    
    return rightColumn;
}
/**
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
 * @param {object} event    
 */
function createCityCountryElement(event) {
    const cityCountry = document.createElement('div');
    cityCountry.className = 'city-country';
    
    const buttonCity = createElementWithText('button', 'button-city', event.city);
    buttonCity.addEventListener('click', onFilterButtonClick);

    const buttonCountry = createElementWithText('button', 'button-country', event.country);
    buttonCountry.addEventListener('click', onFilterButtonClick);

    cityCountry.append(buttonCity, buttonCountry);
    return cityCountry;
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


function saveBasketToLocalStorage(event) {
    const eventCards = document.querySelectorAll('.event-card');
    const basketData = [];

    eventCards.forEach(card => {
        //const eventName = card.querySelector('.name').textContent;
        const ticketCount = card.ticketCount || 0;

        if (ticketCount > 0) {
            basketData.push(event);
            console.log('event in basketdata',basketData)
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
            const eventName = card.querySelectorAll('.name').textContent;

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
export function setLocalStorageFromState(key = 'eventStorage') {
    const storeData = store.getState()
    delete storeData.user
    updateLocalStorage(storeData, key)
}
/**
 * @param{State} storeValue
 */
function updateLocalStorage(storeValue, key = 'eventStorage') {
    localStorage.setItem(key, JSON.stringify(storeValue));
}

export function scrollToTop() {
    const scrollList = document.querySelector('.event-container');
    if (scrollList) {
        scrollList.scrollTop = 0;
    }
}

export function noEventFound () {
    cleanEventContainer()
    const eventContainer = document.querySelector('.event-container');
    const errorImg = document.createElement('img');
    errorImg.className = 'error-img';
    errorImg.src = './imagenes/noEvent.png';
    
    eventContainer.appendChild(errorImg);
}
export function cleanEventContainer() {
    const eventContainer = document.querySelector('.event-container');
    while (eventContainer.firstChild) {
        eventContainer.removeChild(eventContainer.firstChild);
    }
}

export function displayBasketCount () {
    const basketElement = document.querySelector('.basket-counter');
    basketElement.textContent = `BASKET (${basketCount})`
    if(basketCount === 0) {
     basketElement.innerText = "BASKET"
    }
    updateBasketCounter(basketElement)
}
//========================PROFILE===============================//


async function displayProfile() {
    const newTitleForm = document.getElementById('main-title-form');
    newTitleForm.innerText = 'Welcome to your own space';
    
    const newTitleEvent = document.getElementById('main-title-event');
    newTitleEvent.innerText = 'Here you can see your favorite events and create your own event to promote!';
}

async function displayMyEventsPurchased() {
    const myOrdersContainer = document.getElementsByClassName('my-orders');
    const noOrders = document.getElementsByClassName('no-orders');
    const userId = getUserId()
    const filterValue = userId;  
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/events/${filterValue}`);
    console.log('apidata displaymyeventsbought',apiData)
    if (!apiData) {
        return
    } else{
        noOrders[0].style.display = 'none';
        apiData.forEach(event => {
            const eventName = event.name;
            const newElement = document.createElement('h1');
            newElement.textContent = `${eventName}`;
            myOrdersContainer[0].appendChild(newElement);
          });
    }
}

export function displayEditForm() {
    const editForm = document.getElementById('edit-profile-form-container');
    editForm.style.display = 'block';
    cleanEventContainer()
    hidePreviewContainer()
    hideCreateEvents()
    hideEditEvents()
}

export function hideEditProfileForm() {
    const editForm = document.getElementById('edit-profile-form-container');
    editForm.style.display = 'none';
}

/**
 * @param {HTMLElement | null} button
 */ 

export async function displayMyEvents() {
    hideCreateEvents()
    hideEditProfileForm() 
    hidePreviewContainer() 
    hideEditEvents() 
    const eventContainer = document.querySelector('.event-container');
    const userId = getUserId()
    const filterValue = userId;  
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/events/${filterValue}`);

    if (apiData.length === 0) {
        noEventFound()
     } else {
        cleanEventContainer() 
         apiData.forEach(e => {
            const myEventCard = createEventCardWithAnimation(e, eventContainer);
            const rightColumnFind = myEventCard.querySelector('.right-column');
            const leftColumnFind = myEventCard.querySelector('.left-column');
            const removeEventButton = createRemoveEventButton(e);
            const editEventButton = createEditMyEventButton(e);
            rightColumnFind.appendChild(removeEventButton);
            leftColumnFind.appendChild(editEventButton);
        });
    }
}

function createEditMyEventButton(e) {
    const editButton = document.createElement('button')
    editButton.className = 'edit--my-event-button'
    editButton.innerText = 'EDIT'
    let eventId = e._id;
    editButton?.addEventListener('click', () => {
        displayEditMyEvents(eventId);
    });
    
    return editButton
}       

function displayEditMyEvents(event_id) { 
    console.log(event_id)
    cleanEventContainer()
    hideEditProfileForm()
    hidePreviewContainer()
    
    const eventEditorContainer = document.getElementById('edit-event-form-container')
    eventEditorContainer.style.display = 'block'
    const eventEditor = document.getElementById('event-editor')
    eventEditor.setAttribute('eventId', event_id)
    console.log(eventEditor)
}
 export function hideEditEvents(){
    const eventEditor = document.getElementById('edit-event-form-container')
    if (eventEditor) {
        eventEditor.style.display = 'none';
    }
}

function createRemoveEventButton(e) {
    const removeEventButton = document.createElement('button');
    removeEventButton.className = 'remove-event-button';
    removeEventButton.textContent = 'Remove Event';
    let eventId = e._id;
    
    removeEventButton?.addEventListener('click', () => {
        removeEvent(eventId);
    });
    return removeEventButton
}

async function removeEvent (eventId) {
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/delete/event/${eventId}`,'DELETE');
    console.log(apiData)
    alert('Event removed successfully')
}  

export function hideCreateEvents () {
    const eventCreatorForm = document.getElementById('event-creator')
    if (eventCreatorForm) {
        eventCreatorForm.style.display = 'none';
    }
}

export function displayCreateEvents () {
    cleanEventContainer();
    hideEditProfileForm();
    hideEditEvents()
    const eventCreator = document.getElementById('event-creator');
    const cancelChangesEventButton = document.querySelector('#cancel-changes-event-button');
    const saveChangesEventButton = document.querySelector('#save-changes-event-button');
    
    if (eventCreator.style.display === 'none') {
        eventCreator.style.display = 'block';
        if (cancelChangesEventButton) {
            cancelChangesEventButton.remove();
        }
        if (saveChangesEventButton) {
            saveChangesEventButton.remove();
        }
        const submitButton = document.querySelector('#submit-button');
        if (submitButton) {
            submitButton.style.display = 'block';
        }
    } else {
        eventCreator.style.display = 'none';
        const submitButton = document.querySelector('#submit-button');
        if (submitButton) {
            submitButton.style.display = 'none';
        }
    }
    hidePreviewContainer();
}

export function createPreviewContainer() {
    
        let previewContainer = document.querySelector('.preview-container'); 
        if (!previewContainer) {
        const previewContainer = document.createElement('div')
        previewContainer.className = 'preview-container'

        const previewTitle = document.createElement('h1');
        previewTitle.className = 'preview-title';
        previewTitle.innerText = 'YOUR EVENT PREVIEW'; 

        const publishButton = createPublishButton()
        const editEventButton = createEditEventButton()

        previewContainer.append(previewTitle,publishButton,editEventButton);
        document.body.appendChild(previewContainer);
    return previewContainer
}}

function createPublishButton() {
    const newTitleEvent = document.getElementById('main-title-event');
    const publishButton = document.createElement('button')
    publishButton.className = 'publish-button'
    publishButton.innerText = 'PUBLISH'
     
    publishButton.addEventListener('click', async () => {  
        cleanEventContainer()
        let newEvent = JSON.parse(localStorage.getItem('newEventList')); 
        console.log('this is new event',newEvent)
        
        const payload = JSON.stringify(newEvent[0])
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/create/event?`,'POST',payload);
        console.log('this is the data',apiData)
        newTitleEvent.innerText = 'Now you can go to the feed, everybody can see your event! Thanks for contributing to the dance community!';
        hidePreviewContainer()
    })
    return publishButton
}

function createEditEventButton() {
    const editButton = document.createElement('button')
    editButton.className = 'edit-event-button'
    editButton.innerText = 'EDIT'

    editButton.addEventListener('click',displayCreateEvents) 

    return editButton
}
function hidePreviewContainer () {
    let previewContainer = document.querySelector('.preview-container'); 
    if (previewContainer) {
        return previewContainer.remove() ||
               document.body.removeChild(previewContainer);
     }
}
/**
 * @param {HTMLElement | null} inputElement
*/

export function getInputValue(inputElement) {
    if (inputElement instanceof HTMLInputElement) {
        return inputElement.value;
    } else if (inputElement instanceof HTMLSelectElement) {
        return inputElement.value;
    } else if (inputElement instanceof HTMLTextAreaElement) {
        return inputElement.value;
    }
    return '';
}

//========================BASKET===============================//

function displayEventToBuy () {
    const event = getEventFromBasketStorage()
    const eventContainer = document.querySelector('.event-container-basket');

    createEventCardWithAnimation(event,eventContainer)
    const leftColumnFind = document.querySelector('.left-column');
    const findBuyButton = document.querySelector('.buy-button');
    findBuyButton.remove()

    const buyTicketButton = createBuyTicketButton(event);

    leftColumnFind.append(buyTicketButton);
    console.log(leftColumnFind) 
}

function createBuyTicketButton(event) {
    const buyTicketButton = document.createElement('button');
    buyTicketButton.className = 'buy-button';
    buyTicketButton.innerHTML = '<img src="./imagenes/shop.png" alt="shop" class="shop-img">';

    buyTicketButton.addEventListener('click', () => onBuyTicketBasketClick(event))
    return buyTicketButton

}
function onBuyTicketBasketClick (event) {
    const card = document.querySelector('.event-card')
    let ticketCountSpan = card.querySelector('.ticket-count');
    const basketElement = document.getElementsByClassName('basket-counter')
    sumPriceValue(card)   
    card.ticketCount++;

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
    });
    return removeButton;
}

function continueToCheckout() {
    
    let containerSignIn = document.querySelector('.container-signin')
    if (!isUserLoggedIn()) {
        return
    } else if(isUserLoggedIn){
        containerSignIn.innerHTML = '<h1> Continue to<button class="checkout-button">checkout</button>.</h1>'  
        const checkoutButton = document.querySelector('.checkout-button')
        checkoutButton.addEventListener('click', () => displayCheckoutForm(containerSignIn))      
    }
}

function displayCheckoutForm(containerSignIn) {
    const event = getEventFromBasketStorage()
    const eventContainer = document.querySelector('.event-container-basket');
    const checkoutContainer = document.getElementById('checkout-form');
    checkoutContainer.style.display = 'block';
    eventContainer.style.display = 'none';
    containerSignIn.style.display = 'none';
    let event_id=event._id
    checkoutContainer.setAttribute('eventId', event_id)
    console.log('checkoutcontainer',checkoutContainer)
}


/**
 * @param {object} event
 * @param {number} ticketCount
 */  
function updateTicketCount(event, ticketCount) {
    let ticketList = JSON.parse(localStorage.getItem('ticketList')) || [];
    const eventIndex = ticketList.findIndex(item => item.name === event.name);
    if (eventIndex === -1) {
        ticketList.push({ name: event.name, count: ticketCount });
    } else {
        ticketList[eventIndex].count = ticketCount;
    }
    localStorage.setItem('ticketList', JSON.stringify(ticketList));
}
/**
 * Actualiza el contador de tickets en el elemento de la cesta.
 * @param {HTMLElement | null} basketElement 
 */
function updateBasketCounter(basketElement) {
    basketCount = 0; 
    const events = document.querySelectorAll('.event-card')
    events.forEach((event) => {
    basketCount += event.ticketCount    
    localStorage.setItem('basketCount', basketCount)        
    })

    basketElement.textContent = `BASKET (${basketCount})`
    if(basketCount === 0) {
     basketElement.innerText = "BASKET"
}}
/**
 * @param {HTMLElement | null} card
 */
function getPriceValue(card) {
    const priceElement = card.querySelector('.price');
    const priceValue = priceElement.textContent.replace('$', '');

    return priceValue;
}

/**
 * @param {HTMLElement | null} card
 */
function sumPriceValue(card)  {
    const currentTotalPrice = JSON.parse(localStorage.getItem('totalPriceValue')) || 0;
    const priceValue = getPriceValue(card);
    console.log(`Event price: ${priceValue}`);

    totalPriceValue = currentTotalPrice + parseInt(priceValue); // Changed to add priceValue to currentTotalPrice
    localStorage.setItem('totalPriceValue', totalPriceValue); // Removed JSON.stringify
    console.log(`Total price: ${totalPriceValue}`);
}
/**
 * @param {HTMLElement | null} card
 */

function resPricevalue(card) {
    const currentTotalPrice = JSON.parse(localStorage.getItem('totalPriceValue')) || [];
    console.log(`current total price: ${currentTotalPrice}`);
    const priceValue = getPriceValue(card);
    totalPriceValue  = currentTotalPrice - parseInt(priceValue)
 
    localStorage.setItem('totalPriceValue', totalPriceValue); // Removed JSON.stringify
    console.log(`Total price: ${totalPriceValue}`);

}


//========================REGISTER===============================//

/**
 * Handles a successful register from the register component
 * @param {CustomEvent} customEvent - The userList returned from the API
 * @returns void
 */
function onRegisterComponentSubmit (customEvent) {
    console.log(`DESDE FUERA DEL COMPONENTE:`, customEvent);

    let userListData = customEvent.detail
    console.log(userListData)
    saveUserListToLocalStorage(userListData)
    alert('User registered successfully')
    navigateTo('./login.html')
}

export function navigateTo(pathname) {
    const newLocation = {
      ...window.location.href = pathname,
    }
    window.history.pushState({}, '', pathname)
    const newLocationLinked = location.pathname.replace(/\/src/, '')
    console.log(newLocation)
    console.log(newLocationLinked)
  }

function saveUserListToLocalStorage(userList) {
    localStorage.setItem('userList', JSON.stringify(userList));
}
export function updateSessionStorage(storeValue) {
    sessionStorage.setItem('userList', JSON.stringify(storeValue))
    console.log('this is storevalue',storeValue)    
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

//========================LOGIN===============================//

/**
 * Handles a successful login from the login component
 * @param {CustomEvent} customEvent - The user data returned from the API
 * @returns void
 */
function onLoginComponentSubmit(customEvent) {
    const apiData = customEvent.detail
    console.log(`DESDE FUERA DEL COMPONENTE:`, apiData);
    if ('_id' in apiData
      && 'email' in apiData
      && 'nickname' in apiData
      && 'rol' in apiData
      && 'token' in apiData) {
      const userData = /** @type {User} */(apiData)
      updateSessionStorage({ user: userData })
      // Redirect to PROFILE
      navigateTo('./profile.html')
    } else {
      alert('Invalid user data')
    }
  }

 /**
 * Retrieves the userList data from session storage.
 *
 * @returns {State} Saved state.
 * If no data is found, returns an empty State object.
 */

function   getDataFromLocalStorage() {
    const defaultValue = JSON.stringify(INITIAL_STATE)
    return JSON.parse(localStorage.getItem('userList') || defaultValue)
  }

export function getDataFromSessionStorage() {
    const sessionDefaultValue = JSON.stringify({user:[]})
    return JSON.parse(sessionStorage.getItem('userList') || sessionDefaultValue)
}

function getBasketFromLocalStorage() {
    const localBasketDefaultValue = JSON.stringify({0:[]})
    return JSON.parse(localStorage.getItem('basket') || localBasketDefaultValue)

}
  
function checkLoginStatus() {
    /** @type {State} */
    const storedData = getDataFromSessionStorage()
    if (storedData?.user?.token) {
      const storeUserData = /** @type {User} */(storedData?.user)
      delete storeUserData.password
      store.user.login(storeUserData)
    }
}
//========================CONNECT================================//

/**
 * @param {User} user
 */ 
export function createUserCardWithAnimation(user){
    console.log('user dentro de creatin process',user)
    const userCard = createUserCardElement(user); 
    userCard.classList.add('zoom-in');  
    const userContainer = document.querySelector('.user-card-container')
    userCard.addEventListener('animationend', () => {
        userCard.classList.remove('zoom-in');
    });
    userContainer.appendChild(userCard);
    return userCard;
}

/**
 * 
 * @param {User} user
 */ 

function createUserCardElement(user) {
    const userCard = document.createElement('div');
    userCard.className = 'profile-card';

    const imagePlaceholder = document.createElement('img')
    imagePlaceholder.className = 'profile-picture'
    imagePlaceholder.src = './imagenes/profile-pic-placeholder.png'

    const profileInfo = createProfileInfo(user);

    userCard.appendChild(imagePlaceholder);
    userCard.appendChild(profileInfo);

    return userCard;
}

/**
 * 
 * @param {User} user
 */ 

function createProfileInfo(user){
    const profileInfo = document.createElement('div')
    profileInfo.className ='profile-info'

    const nickname = createElementWithText('h1', 'nickname', user.nickname);
    const bio = createBio(user)
    const teamAcademy = createElementWithText('p', 'team-academy', user.teamAcademy);
    
    const followRate = createFollowRateButtons(user)
    profileInfo.append(nickname,bio,teamAcademy,followRate)

    return profileInfo
}

function createBio(user) {
    const bioContainer = document.createElement('p')
    bioContainer.className = 'bio'
    const bio = user.bio
    const rol = user.rol
    bioContainer.innerText = `${bio}. Role: ${rol}`
    return bioContainer
}

function createFollowRateButtons(user) {
    const followRate = document.createElement('div')
    
    const followButton = createFollowButton(user)   
    const rateButton = createRateButton() 

    followRate.append(followButton,rateButton)
    
    return followRate
}

function createFollowButton(user) {
    const userFollowedId = user._id
    console.log('userfollowedID',userFollowedId)
    const currentUserId= getUserId()
    console.log('currentuserID',currentUserId)
    const userFollowedBy = user.followedBy
    
    const followButton = document.createElement('button')
    followButton.className = 'follow-button'
    
    if (!userFollowedBy) {
        followButton.innerText = 'Follow'
        followButton.className = 'follow-button'
    } else {
        followButton.classList.add('unfollow');
        followButton.innerText = 'Unfollow'
    }   
    followButton.addEventListener('click',() => onFollowButtonClick(userFollowedBy,userFollowedId,currentUserId,followButton))
    return followButton
}

function onFollowButtonClick(userFollowedId,currentUserId,followButton,userFollowedBy) {   
    console.log('userfollowedby',userFollowedBy)

    if(!userFollowedBy){
        updateFollowing(userFollowedId,currentUserId)
    } else {
        updateUnFollowing(userFollowedId,currentUserId,userFollowedBy)
    }
   
    toggleFollowButton(followButton,userFollowedId,currentUserId) 
}

async function updateFollowing(userFollowedId,currentUserId){
    let userNewFollower = {
        followedBy: currentUserId
    }
    const payload = JSON.stringify(userNewFollower)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/update/users/${userFollowedId}`, "PUT",payload);
    console.log(apiData)
}

async function updateUnFollowing(userFollowedId,currentUserId,userFollowedBy){
    let userNewFollower = {
        followedBy: ''
    } 
    const payload = JSON.stringify(userNewFollower)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/update/users/${userFollowedId}`, "PUT",payload);
    console.log(apiData)
}

function toggleFollowButton(followButton,userFollowedId,currentUserId) {
    
    if (followButton.classList === 'unfollow') {
        followButton.classList.remove('unfollow');
        followButton.innerText = 'Follow';
    } else {
        followButton.classList.add('unfollow');
        followButton.innerText = 'Unfollow';
    }
}

function createRateButton(user) {
    const rateButton = document.createElement('button')
    rateButton.className = 'rate-button'
    rateButton.innerText = 'Rate'

    return rateButton
}

//========================BACKEND================================//

export async function getAPIData(apiURL, method = 'GET' , data) {
    let apiData
  
    try {
        let headers = new Headers()

        headers.append('Content-Type', 'application/json')
        headers.append('Access-Control-Allow-Origin', '*')
        if (data) {
          headers.append('Content-Length', String(JSON.stringify(data).length))
        }

        if (isUserLoggedIn()) {
            const userData = getDataFromSessionStorage()
            headers.append('Authorization', `Bearer ${userData?.user?.token}`)
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

export function isUserLoggedIn() {
    const userData = getDataFromSessionStorage()
    return userData?.user?.token
  }
export function getUserId() {
    const userData = getDataFromSessionStorage();
    return userData.user._id;
}

function getUserNickname() {
    const userData = getDataFromSessionStorage();
    return userData.user.nickname
}


function getEventFromBasketStorage() {
    const eventData = getBasketFromLocalStorage()
    const eventToget = eventData[0]
    console.log('this is eventdata beggining',eventToget)
    return eventToget
    
}


/**
 * Logs out the user
 * @returns void
 */
async function onLogoutClick() {
    const userData = getDataFromSessionStorage()
    await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/logout/${userData.user._id}`, 'GET')
  
    updateSessionStorage({ user: {} })

    navigateTo('/index.html')
  }
export {
    getDataFromLocalStorage,
    setLocalStorageFromStore
}