//@ts-check

import EVENTS from '../events.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
      // Referencias a elementos del DOM
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
  
      // Evento de clic para el botón de búsqueda
      searchButton?.addEventListener('click', onSearchClick);
  
      // Delegación de eventos para botones dinámicos (tipo de baile y ciudad)
      const eventContainer = document.querySelector('.event-container');
      eventContainer?.addEventListener('click', onFilterButtonClick);
});
/**
 * @param {MouseEvent} event
 * */


function onSearchClick(event) {
    // Prevent the page from reloading
    event.preventDefault();
    // Call the function to validate the event
    /**@type HTMLElement | null */
    const searchTerm = document.getElementById('event-name').value.trim().toLowerCase();

    /**@type HTMLElement | null */
    const eventContainer = document.querySelector('.event-container');
    // Clear the container before showing results
    eventContainer.innerHTML = '';
    // Filter events based on user input
    const filteredEvents = EVENTS.filter(event =>
        event.type.toLowerCase() === searchTerm ||
        event.name.toLowerCase().includes(searchTerm) ||
        event.city.toLowerCase().includes(searchTerm) ||
        event.price.toLowerCase().includes(searchTerm)
    );
    // Show a message if no events are found
    if (filteredEvents.length === 0) {
        let errorImg = document.createElement ('img')
        errorImg.className = ('error-img')
        errorImg.src = '../bryanprestige/imagenes/noEvent.png';
        eventContainer.appendChild(errorImg)
    } else {
        filteredEvents.forEach(event => createEventCard(event,eventContainer));
    }
    scrollToTop()
}

function scrollToTop() {
    const scrollList = document.querySelector('.event-container');
    if (scrollList) {
        scrollList.scrollTop = 0;
    }
}

/**
 * @param {MouseEvent} event
 */
function onFilterButtonClick(event) {
    // The element where the click has happened
    const target = event.target; 
    // If the click was not a button, get out of the function
    if (!(target instanceof HTMLButtonElement)) return; 
    //Get the value of the text in the button converted to lower case
    const filterValue = target.textContent?.toLowerCase(); 
    //If there is no text, as in, the button has no text for any reason, get out of the function.
    if (!filterValue) return;
    /** @type {HTMLElement | null} */
    //Select the events container
    let eventContainer = document.querySelector('.event-container');
    //If the event does not exist for any reason, get out of the function
    if (!eventContainer) return;
    // Clean the container before showing the filteres results
    eventContainer.innerHTML = '';

    let filteredEvents;
    if (target.classList.contains('button-dance-type')) {
        //If the button has the class "button-dance-type", filter the events for event type
        filteredEvents = EVENTS.filter(event => event.type.toLowerCase() === filterValue);
    } else if (target.classList.contains('button-city')) {
        //If the button has the class "button-city", filter the events by city.
        filteredEvents = EVENTS.filter(event => event.city.toLowerCase() === filterValue);
    } else {
        //If the click is not coming from  a button of city or type, get out of the function
        return;
    }
    //If the events are not found, send a message
    if (filteredEvents.length === 0) {
        let errorImg = document.createElement ('img')
        errorImg.src = '../bryanprestige/imagenes/noEvent.png';
        eventContainer.appendChild(errorImg)
    } else {
        // Si se encuentran eventos, crea las tarjetas correspondientes y las agrega al contenedor.
        filteredEvents.forEach(event => createEventCard(event, eventContainer));
    }
}
/**
 * @param {EVENTS} event
 * @param {HTMLElement} container
 * */
function createEventCard(event, container) {
    const card = document.createElement('div');
    card.className = 'event-card';

    //Left Column
    const leftColumn = document.createElement('div');
    leftColumn.className = 'left-column';

    const image = document.createElement('img');
    image.className = 'event-image';
    image.src = '../bryanprestige/imagenes/placehold400x200.png';
    image.alt = `${event.name} image`;
    leftColumn.appendChild(image);

    const name = document.createElement('h1');
    name.className = 'name';
    name.textContent = event.name;
    leftColumn.appendChild(name);

    const address = document.createElement('h1');
    address.className = 'address';
    address.textContent = event.address;
    leftColumn.appendChild(address);

    // Crear el botón de compra
    const buyButton = document.createElement('button');
    buyButton.className = 'buy-button';
    buyButton.innerHTML = '<img src="../bryanprestige/imagenes/shop.png" alt="shop" id="shop-img">'; // Texto placeholder
    buyButton.addEventListener('click', () => {
        alert('Acción de compra por implementar');
    });
    leftColumn.appendChild(buyButton); 
    //Right Column
    const rightColumn = document.createElement('div');
    rightColumn.className = 'right-column';

    const reviews = document.createElement('div');
    reviews.className = 'reviews-placeholder';
    reviews.textContent = 'Reviews Placeholder';
    rightColumn.appendChild(reviews);

    const timePrice = document.createElement('div');
    timePrice.className = 'time-price';

    const time = document.createElement('time');
    time.className = 'time';
    time.setAttribute('datetime', event.time);
    time.textContent = event.time;
    timePrice.appendChild(time);

    const price = document.createElement('h1');
    price.className = 'price';
    price.textContent = event.price;
    timePrice.appendChild(price);

    rightColumn.appendChild(timePrice);

    const typeCity = document.createElement('div');
    typeCity.className = 'type-city';

    const buttonType = document.createElement('button');
    buttonType.className = 'button-dance-type';
    buttonType.textContent = event.type;
    if (event.type.toLowerCase() === 'bachata') {
        buttonType.style.backgroundColor = 'lightgreen';
    } else if (event.type.toLowerCase() === 'salsa') {
        buttonType.style.backgroundColor = 'lightyellow';
    }else if (event.type.toLowerCase() === 'tango') {
        buttonType.style.backgroundColor = '#FF5733';
    }else if (event.type.toLowerCase() === 'zouk') {
        buttonType.style.backgroundColor = '#33C4FF';
    }else if (event.type.toLowerCase() === 'west coast swing') {
        buttonType.style.backgroundColor = '#FFC300';
    }else if (event.type.toLowerCase() === 'kizomba') {
        buttonType.style.backgroundColor = '#fb8500';
    }else if (event.type.toLowerCase() === 'sbk') {
        buttonType.style.backgroundColor = '#ff006e';
    }

    const buttonCity = document.createElement('button');
    buttonCity.className = 'button-city';
    buttonCity.textContent = event.city;

    typeCity.appendChild(buttonType);
    typeCity.appendChild(buttonCity);

    rightColumn.appendChild(typeCity);

    card.appendChild(leftColumn);
    card.appendChild(rightColumn);

    container.appendChild(card);
}
