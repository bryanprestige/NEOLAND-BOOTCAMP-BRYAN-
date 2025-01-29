import {EVENTCREATOR} from './classes/event.js' 

let formIsValid = false;
let eventList = []

document.addEventListener('DOMContentLoaded', () => {
  

    //Declare buttons
   
    const submitButton =document.getElementById('submit-button')
    submitButton.addEventListener('click',onClickSubmitButton)   


    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateForm);
    });

});

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

function onClickSubmitButton(event) {
    event.preventDefault()

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

    const eventData = {
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

    const newEventCreator = new EVENTCREATOR(eventData)
    console.log (newEventCreator)

        createEventCardWithAnimation(newEventCreator, eventContainer)
}

function createEventCardWithAnimation(newEventCreator, container) {
    const card = createEventCardElement(newEventCreator); // Reutiliza la lógica de creación de tarjeta
    card.classList.add('zoom-in'); // Añadir la clase de animación

    // Eliminar la clase después de que la animación termine
    card.addEventListener('animationend', () => {
        card.classList.remove('zoom-in');
    });

    container.appendChild(card);
} 

function createEventCardElement(eventData) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.ticketCount = 0;

    const leftColumn = document.createElement('div');
    leftColumn.className = 'left-column';

    const image = document.createElement('img');
    image.className = 'event-image';
    image.src = '../bryanprestige/imagenes/placehold400x200.png';
    image.alt = `${eventData.name} image`;
    leftColumn.appendChild(image);

    const nameFav = document.createElement('div');
    nameFav.className = 'name-fav';

    const name = document.createElement('h1');
    name.className = 'name';
    name.textContent = eventData.name;
    nameFav.appendChild(name);

    const favButton = document.createElement('button');
    favButton.className = 'fav-button';
    favButton.innerHTML = '<img src="../bryanprestige/imagenes/fav.png" alt="heart" id="heart-img">';
    nameFav.appendChild(favButton);

    leftColumn.appendChild(nameFav);

    const address = document.createElement('h1');
    address.className = 'address';
    address.textContent = eventData.location;
    leftColumn.appendChild(address);

    const buyButton = document.createElement('button');
    buyButton.className = 'buy-button';
    buyButton.innerHTML = '<img src="../bryanprestige/imagenes/shop.png" alt="shop" id="shop-img">';
   /* buyButton.addEventListener('click', () => {
        card.ticketCount++;
        const basketElement = document.getElementById('basket-count');
        const removeButton = leftColumn.querySelector('.remove-button');

        if (!removeButton) {
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-button';
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                card.ticketCount--;
                updateBasketCounter(basketElement);
                if (card.ticketCount === 0) {
                    removeButton.remove();
                }
            });
            leftColumn.appendChild(removeButton);
        }
        updateBasketCounter(basketElement);
    });*/
    leftColumn.appendChild(buyButton);

    const rightColumn = document.createElement('div');
    rightColumn.className = 'right-column';

    const reviews = document.createElement('div');
    reviews.className = 'reviews-placeholder';
    reviews.textContent = 'Reviews Placeholder';
    rightColumn.appendChild(reviews);

    const timePrice = document.createElement('div');
    timePrice.className = 'time-price';

    const time = document.createElement('h1');
    time.className = 'time';
    time.textContent = eventData.time;
    timePrice.appendChild(time);

    const price = document.createElement('h1');
    price.className = 'price';
    price.textContent = eventData.price + "$";
    timePrice.appendChild(price);
    
    rightColumn.appendChild(timePrice);

    const date = document.createElement('h1');
    date.className = 'date';
    date.textContent = eventData.date;
    rightColumn.appendChild(date);

    const musicRatio = document.createElement('h1');
    musicRatio.className = 'music-ratio';
    musicRatio.textContent = eventData.music;

    if (eventData.music.includes("100%")) {
        musicRatio.classList.add('single-style');
      } else if (eventData.music.includes(",")) {
        const ratios = eventData.music.split(",");
        if (ratios.length === 2) {
          musicRatio.classList.add('two-styles');
        } else if (ratios.length === 3 || eventData.music.includes("sbk")) {
          musicRatio.classList.add('three-styles');
        }
      }

    rightColumn.appendChild(musicRatio);

    const typeCity = document.createElement('div');
    typeCity.className = 'type-city';

    const buttonType = document.createElement('button');
    buttonType.className = 'button-dance-type';
    buttonType.textContent = eventData.dance;
    typeCity.appendChild(buttonType);

    const buttonCity = document.createElement('button');
    buttonCity.className = 'button-city';
    buttonCity.textContent = eventData.city;
    typeCity.appendChild(buttonCity);

    rightColumn.appendChild(typeCity);

    card.appendChild(leftColumn);
    card.appendChild(rightColumn);

    const previewContainer = document.createElement('div')
    previewContainer.className = 'preview-container'
    document.body.appendChild(previewContainer);

    const previewTitle = document.createElement('h1');
    previewTitle.className = 'preview-title';
    previewTitle.innerText = 'YOUR EVENT PREVIEW';
    previewContainer.appendChild(previewTitle);

    const publishButton = document.createElement('button')
    publishButton.className = 'publish-button'
    publishButton.innerText = 'PUBLISH'
    previewContainer.appendChild(publishButton);

    const editButton = document.createElement('button')
    editButton.className = 'edit-button'
    editButton.innerText = 'EDIT'
    previewContainer.appendChild(editButton);

    eventList.push(card)
    hideForm()
    return card;
    
}
function hideForm () {
    
    let form = document.getElementById('event-creator');
    if (eventList.length === 1) {
        form.style.display = 'none';
        }
}
/**
 * Actualiza el contador de tickets en el elemento de la cesta.
 * @param {HTMLElement | null} basketElement 
 */
/* function updateBasketCounter(basketElement) {
    basketCount = 0; 
    const events = document.querySelectorAll('.event-card')
    events.forEach((event) => {
    basketCount += event.ticketCount    
    localStorage.setItem('basketCount', basketCount)
})
basketElement.innerText = `BASKET (${basketCount})`
if(basketCount === 0) {
    basketElement.innerText = `BASKET`
}} */

/**
 * Retrieves the value from the specified input element.
 * @param {HTMLElement | null} inputElement - The input element from which to get the value.
 * @returns {string} The value of the input element, or an empty string if the element is null.
 */

//STANDAR SOLUTION FOR CONNECTING CLASSES WITH JS.
function getInputValue(inputElement) {
    if (inputElement) {
      return /** @type {HTMLInputElement} */(inputElement).value
    } else {
      return ''
    }
}
  

