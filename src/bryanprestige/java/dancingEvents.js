
import EVENTS from '../events.json' with { type: 'json' };

let basketCount = 0;    

document.addEventListener('DOMContentLoaded', () => {
    //Display all events when the page is loaded
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
});

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

/**
 * @param {MouseEvent} event
 * */
function onSearchClick(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('event-name').value.trim().toLowerCase();
    const eventContainer = document.querySelector('.event-container');

    const filteredEvents = EVENTS.filter(event =>
        event.type.toLowerCase().includes(searchTerm) ||
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
        if (target.classList.contains('button-dance-type')) return event.type.toLowerCase() === filterValue;
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
    const basketElement = document.querySelector('#basket-counter');
    const storedBasketCount = localStorage.getItem('basketCount') || 0;
    basketElement.innerText = `BASKET (${storedBasketCount})`;
}

function createEventCardElement(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.ticketCount = 0;

    const leftColumn = createLeftColumn(event, card);
    const rightColumn = createRightColumn(event);

    card.appendChild(leftColumn);
    card.appendChild(rightColumn);

    loadBasketFromLocalStorage()
    return card;
}

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

    const basketElement = document.querySelector('#basket-counter');
    buyButton.addEventListener('click', () => handleBuyButtonClick(card, event, basketElement));

    return buyButton;
}

function handleBuyButtonClick(card, event, basketElement) {
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

function createRemoveButton(card, event, basketElement, ticketCountSpan) {
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'Remove';

    removeButton.addEventListener('click', (e) => {
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
    const basketElement = document.querySelector('#basket-counter');

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

    const buttonType = createButtonWithStyle('button-dance-type', event.type, getDanceTypeColor(event.type));
    const buttonCity = createElementWithText('button', 'button-city', event.city);

    typeCity.append(buttonType, buttonCity);
    return typeCity;
}

function createButtonWithStyle(className, textContent, backgroundColor) {
    const button = createElementWithText('button', className, textContent);
    button.style.backgroundColor = backgroundColor;
    return button;
}

function getDanceTypeColor(type) {
    switch(type.toLowerCase()) {
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
    }
}
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
    getFavEvents()// Recuperar favoritos desde localStorage
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