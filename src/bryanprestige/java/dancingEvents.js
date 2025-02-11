
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

        document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateForm);
        })

        displayProfile();
        
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
        //const eventContainer = document.querySelector('.event-container');
        //eventContainer?.addEventListener('click', onFilterButtonClick);

        const favoriteButton = document.getElementById('favorite-button');
        favoriteButton?.addEventListener('click', displayFavoriteEvents);        
    }
    checkLoginStatus()
});

/*TO DO: MAKE BASKET COUNT APPEAR IN EVERY PAGE*/   
/*TO DO: DISPLAY EVENTS BOUGHT ON THE BASKET.HTML*/
/*TO DO: FINISh STYLE OF THE BASKET PAGE*/

/*TO DO: RESTRICT PROFILE AND OPTIONS TO LOGGED IN USERS*/
/*TO DO: SHOW LOG OUT BUTTON INSTEAD OF LOG IN BUTTON WHEN USER IS LOGGED IN*/

/*TO DO: FILTRADO POR FECHA, BUSQUEDA DE FECHA EXACTA Y FILTRO ENTRE DOS FECHAS*/
/*TO DO: FIX ON SEARCH CLICK NOEVENT()*/
/*TO DO: MAKE REMOVE EVENT IN MY EVENTS SECTION*/

/*TO DO: RESTRIC FAV BUTTON TO LOGGED IN USERS*/
/*TO DO: MAKE EDIT EVENT BUTTON WORK*/
/*TO DO: CREATE ALL THE EVEETS ASSOCIATED TO THE USERS*/
/*TO DO: EDIT WITH DISPLAY OF EDIT FORM AND WORKING*/


//====================FEED=====================//

/**
 * @param {MouseEvent} event
 */
async function onSearchClick(event) {
    event.preventDefault();
    
    const searchField = document.getElementById('search-field').value.trim().toLowerCase();
    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/filter/events/${searchField}`);

    const eventContainer = document.querySelector('.event-container');

    if (searchField.length === !apiData) { 
        noEventFound()
    } else {
        cleanEventContainer()
        apiData.forEach(event => createEventCardWithAnimation(event,eventContainer));
    }
    loadBasketFromLocalStorage()  
    scrollToTop();
}
/**
 * @param {MouseEvent} event
 */
async function onFilterButtonClick(e) {
    e.preventDefault();
    const target = e.target;
    const filterValue = target?.textContent?.toLowerCase();  
    
    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/filter/events/${filterValue}`);
    /*
    if (!(target instanceof HTMLButtonElement) ||
        target.classList.contains('remove-button') ||
        target.classList.contains('favorite-button') ||
        target.classList.contains('instagram-img') ||
        target.classList.contains('buy-button')) 
        return;*/
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
 * @param {MouseEvent} event
 */
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
    const showForm = document.getElementById('event-creator')
    if (showForm) {
        showForm.style.display = 'none';
    }
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
    
    return card;
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

function createInstagramAnchor(event) {
    const instagramAnchor = document.createElement('a');
    instagramAnchor.className = 'instagram-anchor';
    instagramAnchor.href = event.url;
    instagramAnchor.innerHTML = '<img src="./imagenes/instagram.png" alt="instagram" class="instagram-img">';
    instagramAnchor.target = '_blank';

    if (!event.url || event.url.trim() === "") {
        instagramAnchor.style.display = 'none';
    }
    return instagramAnchor;
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
    buyButton.innerHTML = '<img src="./imagenes/shop.png" alt="shop" class="shop-img">';


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
 * @param {object} event 
 */ 
function createPriceCurrencyElement(event) {
    const priceCurrency = document.createElement('div');
    priceCurrency.className = 'price-currency';

    const currency = createElementWithText('currency', 'currency', event.currency);
    currency.setAttribute('select', event.currency);
    const price = createElementWithText('h1', 'price', event.price);

    priceCurrency.append(currency, price);
    return priceCurrency
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
    delete storeData.user
    updateLocalStorage(storeData, key)
}
/**
 * @param{State} storeValue
 */
function updateLocalStorage(storeValue, key = 'eventStorage') {
    localStorage.setItem(key, JSON.stringify(storeValue));
}
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
    const priceValue = getPriceValue(card);
    console.log(`Event price: ${priceValue}`);

    totalPriceValue += parseInt(priceValue);
    localStorage.setItem('totalPriceValue', JSON.stringify(totalPriceValue));
}
/**
 * @param {HTMLElement | null} card
 */

function resPricevalue(card) {
    const priceValue = getPriceValue(card);
    totalPriceValue -= parseInt(priceValue);

    localStorage.setItem('totalPriceValue', JSON.stringify(totalPriceValue));
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
//========================PROFILE===============================//


async function displayProfile() {

    const storedData = getDataFromSessionStorage();
    const user = storedData.user;
    const nickname = user.nickname;
    
    const profileCard = createProfileCard(nickname);
    console.log(profileCard);
    const newTitleForm = document.getElementById('main-title-form');
    newTitleForm.innerText = 'Welcome to your own space';
    
    const newTitleEvent = document.getElementById('main-title-event');
    newTitleEvent.innerText = 'Here you can see your favorite events and create your own event to promote!';

  }

function createProfileCard (nickname) {

    const profileCardContainer = document.getElementById('profile-card-container');
    const cardContainer = document.createElement('div');
    cardContainer.className = 'profile-card';
    
    const profilePicPlacehold = document.createElement('img');
    profilePicPlacehold.className = 'profile-picture';
    profilePicPlacehold.src = './imagenes/profile-pic-placeholder.png';
    
    const profileInfo = createProfileInfo(nickname,cardContainer);
    console.log(profileInfo);
    cardContainer.append(profilePicPlacehold,profileInfo);
    profileCardContainer.appendChild(cardContainer);
    return profileCardContainer
}

function createProfileInfo(nickname,cardContainer) {
    const profileInfo = document.createElement('div');
    profileInfo.className = 'profile-info';

    const userNickname = createElementWithText('h1', 'nickname', nickname);

    const bio = document.createElement('p');
    bio.className = 'bio';
    bio.innerText = 'Bio';

    const company = document.createElement('p');
    company.className = 'team-academy';
    company.innerText = 'Team Academy';

    const editFavProfile = createEditFavProfile(cardContainer);
    const createMyEventsProfile = createCreateMyEventsButton(cardContainer);

    profileInfo.append(userNickname,bio,company,editFavProfile,createMyEventsProfile);
    return profileInfo
}


function createEditFavProfile(user) {
    const editFavProfile = document.createElement('div');
    editFavProfile.className = 'edit-fav-profile';

    const editProfileButton = createEditProfileButton(user);
    const favButtonProfile = createFavButtonProfile(user);

    editFavProfile.append(editProfileButton,favButtonProfile);
    return editFavProfile
}

/**
 * @param {HTMLElement | null} button
 */ 

function createEditProfileButton(){
    const editButton = document.createElement('button');
    editButton.id = 'edit-profile-button';
    editButton.textContent = 'Edit Profile';
   
    return editButton
}

/**
 * @param {HTMLElement | null} button
 */ 

function createFavButtonProfile() {
    const favButtonProfile = document.createElement('button');
    favButtonProfile.id = 'fav-button-profile';
    favButtonProfile.textContent = 'Favorites';
    
    favButtonProfile?.addEventListener('click',displayFavoriteEvents)
    displayBasketCount() 

    return favButtonProfile
}

function createCreateMyEventsButton(event) {
    const createMyEventsProfile  = document.createElement('div');
    createMyEventsProfile.className = 'create-myEvents-profile';

  
    const createEventsButton = createCreateEventsButton(event);
    const myEventsButton = createMyEventsButton(event);

    createMyEventsProfile.append(createEventsButton,myEventsButton);
    return createMyEventsProfile
}

function createMyEventsButton() {
    const myEventsButton = document.createElement('button');
    myEventsButton.id = 'my-events-button';
    myEventsButton.textContent = 'My Events';
    myEventsButton?.addEventListener('click',displayMyEvents)

    return myEventsButton
}

async function displayMyEvents(e) {
    e.preventDefault();
    hideCreateEvents()

    const eventContainer = document.querySelector('.event-container');
    const getUserId = getDataFromSessionStorage();
    const user = getUserId.user;
    const userId = user._id;
    console.log(userId)

    const filterValue = userId;  
    
    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/filter/events/${filterValue}`);

    if (!apiData) {
        noEventFound()
     } else {
        cleanEventContainer() 
         apiData.forEach(e => {
            const myEventCard = createEventCardWithAnimation(e, eventContainer);
            const rightColumnFind = myEventCard.querySelector('.right-column');
            const removeEventButton = createRemoveEventButton(e);
            console.log(removeEventButton)
            rightColumnFind.appendChild(removeEventButton);
            });
        }  

        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
          previewContainer.remove();
       }    
}

function createRemoveEventButton(e) {

    const removeEventButton = document.createElement('button');
    removeEventButton.className = 'remove-event-button';
    removeEventButton.textContent = 'Remove Event';
    let eventId = e._id;
    console.log(eventId)
    
    removeEventButton?.addEventListener('click', () => {
        removeEvent(eventId);
    });

    return removeEventButton
}

async function removeEvent (eventId) {
    console.log('remove event')
    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/delete/event/${eventId}`,'DELETE');
    console.log(apiData)
    alert('Event removed successfully')
} 

function createCreateEventsButton() {
    const createEventsButton = document.createElement('button');
    createEventsButton.id = 'create-events-button';
    createEventsButton.textContent = 'Create Events';
    createEventsButton?.addEventListener('click',displayCreateEvents)

    return createEventsButton
}

function hideCreateEvents () {
    cleanEventContainer()
    const hideForm = document.getElementById('event-creator')
    hideForm.style.display = 'none';
}

function displayCreateEvents () {
    cleanEventContainer()
    const showForm = document.getElementById('event-creator')
    showForm.style.display = 'block';
}

function onClickSubmitButton(event) {
    event.preventDefault()
    hideCreateEvents()
    const newTitleEvent = document.getElementById('main-title-event');
    newTitleEvent.innerText = 'Have a look at your new event, check it out before pusblishing or edit it if you need!';

    if (validateForm() === false) {
        alert("Please ensure all fields are correctly filled before submitting.");
        return; 
    }else {
     cleanEventContainer()   
     createNewEvent()
     createPreviewContainer(event)   
    }
}

async function createNewEvent () {
    //const flyer = document.getElementById('subtmit-flyer')
    const name = document.getElementById('input-event-name')
    const venue = document.getElementById('input-venue')    
    const dateTime = document.getElementById('input-dateTime')
    const price = document.getElementById('input-price')
    const currency = document.getElementById('input-currency')
    const music = document.getElementById('input-music-ratio')
    const country = document.getElementById('input-country')
    const city = document.getElementById('input-city')
    const dance = document.getElementById('input-dance')
    const url = document.getElementById('input-url')
    const eventContainer = document.querySelector('.event-container');
    
    const getUserId = getDataFromSessionStorage();
    console.log(getUserId)
    const user = getUserId.user;
    const userId = user._id;

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
        user_id: userId
    }
    console.log(event)
    newEventList.push(event)
    saveNewEventToLocalStorage(newEventList)
    createEventCardWithAnimation(event, eventContainer)
    hideForm()
}

function createPreviewContainer(event) {
        let previewContainer = document.querySelector('.preview-container'); 
        if (!previewContainer) {
        const previewContainer = document.createElement('div')
        previewContainer.className = 'preview-container'

        const previewTitle = document.createElement('h1');
        previewTitle.className = 'preview-title';
        previewTitle.innerText = 'YOUR EVENT PREVIEW'; 

        const publishButton = createPublishButton(event)
        const editButton = createEditButton(event)

        previewContainer.append(previewTitle,publishButton,editButton);
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
         hidePreviewContainer()
    let newEvent = JSON.parse(localStorage.getItem('newEventList')); 
    
    const payload = JSON.stringify(newEvent[0])
    const apiData = await getAPIData(`http://${location.hostname}:${PORT}/create/event?`,'POST',payload);
    console.log('this is the data',apiData)
    newTitleEvent.innerText = 'Now you can go to the feed, everybody can see your event! Thanks for contributing to the dance community!';
    })
    
    return publishButton
}

function hidePreviewContainer () {
    let previewContainer = document.querySelector('.preview-container'); 
    document.body.removeChild(previewContainer);
}
function createEditButton() {
    const editButton = document.createElement('button')
    editButton.className = 'edit-event-button'
    editButton.innerText = 'EDIT'

    return editButton
}
 //TODO:

/**
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
    const venue = document.getElementById('input-venue');
    const date = document.getElementById('input-date');
    const time = document.getElementById('input-time');
    const price = document.getElementById('input-price');
    const currency = document.getElementById('input-currency');
    const music = document.getElementById('input-music-ratio');
    const city = document.getElementById('input-city');
    const country = document.getElementById('input-country');
    const dance = document.getElementById('input-dance');
  
    const submitButton = document.getElementById('submit-button');

    const fields = [name, venue, date, time, price, currency, music, city,country, dance];
    formIsValid = fields.every(field => field?.value.trim() !== '');

    submitButton.disabled = !formIsValid;

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

//========================REGISTER===============================//

/**
 * @param {MouseEvent} e
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
    console.log(userList)
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
    console.log(userList)
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

//========================LOGIN===============================//
async function onLoginFormSubmit(event){
    const emailElement = document.getElementById('email')
    const passwordElement = document.getElementById('password')
    const loginData = {
      email: getInputValue(emailElement),
      password: getInputValue(passwordElement)
    }
  
    event.preventDefault() 
  
    if (loginData.email !== '' && loginData.password !== '') {
        const payload = JSON.stringify(loginData)

        const apiData = await getAPIData(`http://${location.hostname}:${PORT}/login`,'POST', payload);
        
        if (!apiData) {
            //show error
            alert('user dont exist')
        } else {
            if ('_id' in apiData
                && 'email' in apiData
                && 'nickname' in apiData
                && 'name' in apiData
                && 'rol' in apiData
                && 'token' in apiData
                ) {
                    const userData = /** @type {User} */(apiData)
                    updateSessionStorage({ user: userData })
                    navigateTo('./profile.html')
            } else {
                alert('Invalid user data')
            }
        }
    }
}    
  
 /**
 * Retrieves the userList data from session storage.
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
  
function checkLoginStatus() {
    /** @type {State} */
    const storedData = getDataFromSessionStorage()
    if (storedData?.user?.token) {
      const storeUserData = /** @type {User} */(storedData?.user)
      delete storeUserData.password
      store.user.login(storeUserData)
    }
}

//========================BACKEND================================//

async function getAPIData(apiURL, method = 'GET' , data) {
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

  function isUserLoggedIn() {
    const userData = getDataFromSessionStorage()
    return userData?.user?.token
  }

/**
 * Check user login status
 */
export {
    getDataFromLocalStorage,
    setLocalStorageFromStore
}