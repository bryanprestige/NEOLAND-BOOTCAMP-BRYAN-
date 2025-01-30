import EVENTS from '../events.json' with { type: 'json' };
import {EVENTCREATOR} from './classes/event.js' 

let basketCount = 0;    
let formIsValid = false;
let eventList = []
let totalPriceValue = 0;

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('profile.html')) {
        const submitButton =document.getElementById('submit-button')
        submitButton.addEventListener('click',onClickSubmitButton)   
        
        document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateForm);
        })
    } else if (window.location.pathname.includes('dancingEvents.html')) {
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
        
        loadBasketFromLocalStorage()
    }
});

function onSearchClick(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('event-name').value.trim().toLowerCase();
    const eventContainer = document.querySelector('.event-container');

    const filteredEvents = EVENTS.filter(event =>
        event.dance.toLowerCase().includes(searchTerm) ||
        event.name.toLowerCase().includes(searchTerm) ||
        event.city.toLowerCase().includes(searchTerm) ||
        event.price.toLowerCase().includes(searchTerm)
    );

    if (filteredEvents.length === 0) {
        const errorImg = document.createElement('img');
        errorImg.className = 'error-img';
        errorImg.src = '../bryanprestige/imagenes/noEvent.png';
        eventContainer.innerHTML = '';
        eventContainer.appendChild(errorImg);
    } else {
        eventContainer.innerHTML = '';
        filteredEvents.forEach(event => createEventCardWithAnimation(event, eventContainer));
    }

    loadBasketFromLocalStorage()
    scrollToTop();
}

function onClickSubmitButton(e) {
    e.preventDefault()

    validateForm();
    if (!formIsValid) {
        alert("Please ensure all fields are correctly filled before submitting.");
        return; // Detener si el formulario no es válido
    }

    //const flyer = document.getElementById('subtmit-flyer')
    const name = document.getElementById('input-event-name')
    const location = document.getElementById('input-address')
    const date = document.getElementById('input-date')
    const time = document.getElementById('input-time')
    const price = document.getElementById('input-price')
    const music = document.getElementById('input-music-ratio')
    const city = document.getElementById('input-city')
    const dance = document.getElementById('input-dance')
    const eventContainer = document.querySelector('.event-container');

    let event = {
        //flyer: getInputValue(flyer),
        name: getInputValue(name),
        location: getInputValue(location),
        date: getInputValue(date),
        time: getInputValue(time),
        price: getInputValue(price),
        music: getInputValue(music),
        city: getInputValue(city),
        dance: getInputValue(dance),
    }

    const newEventCreator = new EVENTCREATOR(event)
    console.log (newEventCreator)

    createEventCardWithAnimation(newEventCreator, eventContainer)
    hideForm() 
}
/**
 * @param {MouseEvent} event
 */
function onFilterButtonClick(event) {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLButtonElement) || target.classList.contains('remove-button') || target.classList.contains('favorites-button')) return;
    const filterValue = target.textContent?.toLowerCase();
    if (!filterValue) return;
    const eventContainer = document.querySelector('.event-container');
    if (!eventContainer) return;
    eventContainer.innerHTML = '';
    const filteredEvents = EVENTS.filter(event => {
        if (target.classList.contains('button-dance-type')) return event.dance.toLowerCase() === filterValue;
        if (target.classList.contains('button-city')) return event.city.toLowerCase() === filterValue;
    });
    if (filteredEvents.length === 0) {
        const errorImg = document.createElement('img');
        errorImg.src = '../bryanprestige/imagenes/noEvent.png';
        eventContainer.appendChild(errorImg);
    } else {
        filteredEvents.forEach(event => {
            createEventCardWithAnimation(event, eventContainer);
        });
    }
    const basketElement = document.querySelector('.basket-counter');
    const storedBasketCount = localStorage.getItem('basketCount') || 0;
    basketElement.innerText = `BASKET (${storedBasketCount})`;

    scrollToTop();
}

function createEventCardElement(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.ticketCount = 0;

    const leftColumn = createLeftColumn(event, card);
    const rightColumn = createRightColumn(event);

    card.appendChild(leftColumn);
    card.appendChild(rightColumn);

    createPreviewContainer()   

    //loadBasketFromLocalStorage()
    eventList.push(card)
    return card;
}

function createPreviewContainer() {
    if (window.location.pathname.includes('profile.html')) {
     
    const previewContainer = document.createElement('div')
    previewContainer.className = 'preview-container'
   
    const previewTitle = document.createElement('h1');
    previewTitle.className = 'preview-title';
    previewTitle.innerText = 'YOUR EVENT PREVIEW'; 

    const publishButton = document.createElement('button')
    publishButton.className = 'publish-button'
    publishButton.innerText = 'PUBLISH'
    
    const editButton = document.createElement('button')
    editButton.className = 'edit-button'
    editButton.innerText = 'EDIT'

    previewContainer.append(previewTitle,publishButton,editButton);
    document.body.appendChild(previewContainer);
    
    return previewContainer
}}

function createLeftColumn(event, card) {
    const leftColumn = document.createElement('div');
    leftColumn.className = 'left-column';

    const image = createImageElement(event.name);
    const nameFav = createNameFavElement(event);
    const address = createElementWithText('h1', 'address', event.location);
    const buyButton = createBuyButton(card, event);

    leftColumn.append(image, nameFav, address, buyButton);

    return leftColumn;
}

function createRightColumn(event) {
    const rightColumn = document.createElement('div');
    rightColumn.className = 'right-column';

    const reviews = createElementWithText('div', 'reviews-placeholder', 'Reviews Placeholder');
    const timePrice = createTimePriceElement(event);
    const date = createElementWithText('h1', 'date', event.date);
    const musicRatio = createMusicRatioElement(event.music);
    const typeCity = createTypeCityElement(event);

    rightColumn.append(reviews, timePrice, date, musicRatio, typeCity);

    return rightColumn;
}

function createImageElement(eventName) {
    const image = document.createElement('img');
    image.className = 'event-image';
    image.src = '../bryanprestige/imagenes/placehold400x200.png';
    image.alt = `${eventName} image`;
    return image;
}

function createNameFavElement(event) {
    const nameFav = document.createElement('div');
    nameFav.className = 'name-fav';

    const name = createElementWithText('h1', 'name', event.name);
    const favButton = createFavButton(event);

    nameFav.append(name, favButton);
    return nameFav;
} 

function createFavButton(event) {
    const favButton = document.createElement('button');
    favButton.className = 'fav-button';
    favButton.innerHTML = '<img src="../bryanprestige/imagenes/fav.png" alt="heart" id="heart-img">';

    const favList = JSON.parse(localStorage.getItem('favList')) || [];
    if (favList.some(favEvent => favEvent.name === event.name)) {
        favButton.classList.add('favorited');
    }

    favButton.addEventListener('click', () => toggleFavorite(event, favButton));

    return favButton;
}

function createBuyButton(card, event) {
    const buyButton = document.createElement('button');
    buyButton.className = 'buy-button';
    buyButton.innerHTML = '<img src="../bryanprestige/imagenes/shop.png" alt="shop" id="shop-img">';

    const basketElement = document.querySelector('.basket-counter');
    buyButton.addEventListener('click', () => handleBuyButtonClick(card, event, basketElement));

    return buyButton;
}


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
function sumPriceValue(card)  {
    const priceValue = getPriceValue(card);
    console.log(`Event price: ${priceValue}`);

    totalPriceValue += parseInt(priceValue);
    console.log(`Total price: ${totalPriceValue}`);
    localStorage.setItem('totalPriceValue', JSON.stringify(totalPriceValue));
}


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


function resPricevalue(card) {
    const priceValue = getPriceValue(card);
    console.log(`Event price: ${priceValue}`);
    totalPriceValue -= parseInt(priceValue);
    console.log(`Total price: ${totalPriceValue}`)

    localStorage.setItem('totalPriceValue', JSON.stringify(totalPriceValue));
}

function createTimePriceElement(event) {
    const timePrice = document.createElement('div');
    timePrice.className = 'time-price';

    const time = createElementWithText('time', 'time', event.time);
    time.setAttribute('datetime', event.time);
    const price = createElementWithText('h1', 'price', event.price);

    timePrice.append(time, price);
    return timePrice;
}

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

function createTypeCityElement(event) {
    const typeCity = document.createElement('div');
    typeCity.className = 'type-city';

    const buttonType = createButtonWithStyle('button-dance-type', event.dance, getDanceTypeColor(event.dance));
    const buttonCity = createElementWithText('button', 'button-city', event.city);

    typeCity.append(buttonType, buttonCity);
    return typeCity;
}

function createButtonWithStyle(className, textContent, backgroundColor) {
    const button = createElementWithText('button', className, textContent);
    button.style.backgroundColor = backgroundColor;
    return button;
}

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

function createElementWithText(tag, className, textContent) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
}

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
    console.log("Lista de favoritos actualizada:", favList); 
}

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
 * 
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

function createEventCardWithAnimation(event, container) {
    const card = createEventCardElement(event); 
    card.classList.add('zoom-in'); 
    
    card.addEventListener('animationend', () => {
        card.classList.remove('zoom-in');
    });
    
    container.appendChild(card);
    loadBasketFromLocalStorage()
}

function scrollToTop() {
    const scrollList = document.querySelector('.event-container');
    if (scrollList) {
        scrollList.scrollTop = 0;
    }
}

function updateDefaultFeed() {
    const eventContainer = document.querySelector('.event-container');
    cleanEventContainer()
    EVENTS.forEach(event => {
        createEventCardWithAnimation(event, eventContainer);
    });
}
function displayFavoriteEvents(event) {
    event.preventDefault(); //Prevent the page from reloading
    cleanEventContainer() // Limpiar el contenedor antes de mostrar los favoritos
    getFavEvents(event)// Recuperar favoritos desde localStorage
}

function getFavEvents() {
    const eventContainer = document.querySelector('.event-container');
    let favList = JSON.parse(localStorage.getItem('favList')) || [];

    if (favList.length === 0) {
        // Mostrar imagen si no hay eventos favoritos
        let errorImg = document.createElement('img');
        errorImg.className = 'error-img';
        errorImg.src = '../bryanprestige/imagenes/noEvent.png';
        eventContainer.appendChild(errorImg);
    } else {
        // Mostrar solo los eventos favoritos
        favList.forEach(event => {
            createEventCardWithAnimation(event, eventContainer);
        });
    }
    console.log(favList)
}

function cleanEventContainer(){
    const eventContainer = document.querySelector('.event-container');
    eventContainer.innerHTML = ''; 
}

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
    const name = document.getElementById('input-event-name');
    const location = document.getElementById('input-address');
    const date = document.getElementById('input-date');
    const time = document.getElementById('input-time');
    const price = document.getElementById('input-price');
    const music = document.getElementById('input-music-ratio');
    const city = document.getElementById('input-city');
    const dance = document.getElementById('input-dance');
  
    const submitButton = document.getElementById('submit-button');

    // Verificar si todos los campos están rellenos
    const fields = [name, location, date, time, price, music, city, dance];
    formIsValid = fields.every(field => field?.value.trim() !== '');

    // Habilitar o deshabilitar el botón según la validez
    submitButton.disabled = !formIsValid;

    const fieldsEmpty = [
        'input-event-name',
        'input-address',
        'input-date',
        'input-time',
        'input-price',
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
}
        
function getPriceValue(card) {
    const priceElement = card.querySelector('.price');
    const priceValue = priceElement.textContent.replace('$', '');
    return priceValue;
}