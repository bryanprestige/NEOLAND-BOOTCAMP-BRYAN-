import EVENTS from '../eventos.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', () => {
    //SearchButton Function Loaded
    const searchButton = document.getElementById('search-button');
    searchButton.addEventListener('click', onSearchClick);
});

function onSearchClick(event) {
    //Stop de reloaded of the
    event.preventDefault(); 
    const searchTerm = document.getElementById('event-name').value.trim().toLowerCase();
    const eventContainer = document.querySelector('.event-container');
    //Clean the container before showing the results
    eventContainer.innerHTML = ''; 
    // Filter events to match the input from the user
    const filteredEvents = EVENTS.filter(event =>
        event.type.toLowerCase() === searchTerm
        || event.name.toLowerCase().includes(searchTerm) 
        || event.city.toLowerCase().includes(searchTerm)
        || event.price.toLowerCase().includes(searchTerm)
    )
    //Condition to to give error in case no input, create event in case right input.
    if (filteredEvents.length === 0) {
        eventContainer.innerHTML = '<p>No events found for your search.</p>';
    } else {
        filteredEvents.forEach(event => createEventCard(event, eventContainer));
    }
    emptySearchField()
}

function emptySearchField () {
    document.getElementById('event-name').value = '';
}

function createEventCard(event, container) {
    const eventContainer = document.createElement('div');
    eventContainer.className = 'event-container';

    // Columna izquierda
    const leftColumn = document.createElement('div');
    leftColumn.className = 'left-column';

    const eventImage = document.createElement('img');
    eventImage.src = '../bryanprestige/imagenes/placehold400x200.png'; // Cambiar si hay URL real
    eventImage.alt = `${event.name} image`;
    eventImage.className = 'event-image';

    const name = document.createElement('h1');
    name.className = 'name';
    name.textContent = event.name;

    const address = document.createElement('h1');
    address.className = 'address';
    address.textContent = event.address;

    leftColumn.appendChild(eventImage);
    leftColumn.appendChild(name);
    leftColumn.appendChild(address);

    // Columna derecha
    const rightColumn = document.createElement('div');
    rightColumn.className = 'right-column';

    const reviewsPlaceholder = document.createElement('div');
    reviewsPlaceholder.className = 'reviews-placeholder';
    reviewsPlaceholder.textContent = 'Reviews Placeholder';

    const timePrice = document.createElement('div');
    timePrice.className = 'time-price';

    const time = document.createElement('time');
    time.className = 'time';
    time.setAttribute('datetime', event.time);
    time.textContent = event.time;

    const price = document.createElement('h1');
    price.className = 'price';
    price.textContent = event.price;

    timePrice.appendChild(time);
    timePrice.appendChild(price);

    const typeCity = document.createElement('div');
    typeCity.className = 'type-city';

    const buttonType = document.createElement('button');
    buttonType.className = 'button-dance-type';
    buttonType.textContent = event.type;

    if (event.type.toLowerCase() === 'bachata') {
        buttonType.style.backgroundColor = 'lightgreen';
    } else if (event.type.toLowerCase() === 'salsa') {
        buttonType.style.backgroundColor = 'lightyellow';
    }

    const buttonCity = document.createElement('button');
    buttonCity.className = 'button-city';
    buttonCity.textContent = event.city;

    typeCity.appendChild(buttonType);
    typeCity.appendChild(buttonCity);

    rightColumn.appendChild(reviewsPlaceholder);
    rightColumn.appendChild(timePrice);
    rightColumn.appendChild(typeCity);

    // Agregar columnas al contenedor principal
    eventContainer.appendChild(leftColumn);
    eventContainer.appendChild(rightColumn);

    // Agregar evento a la lista principal
    container.appendChild(eventContainer);
}

