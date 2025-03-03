/* 
//@ts-check
  */
import {INITIAL_STATE,store} from '../storeRedux/redux.js'
import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './classes/HttpError.js'
//import { isConstructorDeclaration } from 'typescript';
/**
 * @import {Event} from './classes/Event.js'
 * @import {User}   from './classes/User.js'
 */

export const PORT = location.port ? `:${location.port}` : ''

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
        window.addEventListener('login-form-submit', (event) => {
            onLoginComponentSubmit(/** @type {CustomEvent} */(event).detail)
          })        
    }
    else if (window.location.pathname.includes('register.html')) {
        window.addEventListener('create-user', onRegisterComponentSubmit)
    }
    else if (window.location.pathname.includes('basket.html')) {
        displayEventToBuy()
        continueToCheckout()
    }
    else if (window.location.pathname.includes('reviews.html')) {
        displayUserToRate ()
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
/*TO DO: RESTRIC FAV BUTTON TO LOGGED IN USERS*/
/*TO DO: FINISH FIND.HTMLL STYLE AND FUNCTIONALITIES*/
/*TO DO: FINISH CONNECTHMTL.HTMLL STYLE AND FUNCTIONALITIES*/
/*TO DO: FIX HYPERLINKS TO INSTAGRAM PROFILES*/
/*TO DO: FIX STYLING, ADD MEDIA QUERYES*/
/*TO DO: MAKE EVERY CLICK ON MY EVENT ORDEREDTO GET TOU A RAMDON QR CODE AS A MOCH OF A TICKET TO THE EVENT*/

//====================FEED=====================//

/**
 * @param {MouseEvent} e
 */
export async function onFilterButtonClick(e) {
    e.preventDefault();
    const target = e.target;
    const filterValue = target.textContent.toLowerCase();  
    
    const eventContainer = document.querySelector('.event-container');
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/events/${filterValue}`);
  
    if (!apiData) return;
    if (!eventContainer) return;
    cleanEventContainer();
  
    apiData.forEach(e => {
        createEventCardWithAnimation(e, eventContainer);
    })
   
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

/**`
 * @param {MouseEvent} event
 */

export function displayFavoriteEvents(event) {
    event.preventDefault(); 
    hideCreateEvents()
    hideEditEvents()
    const userId = getUserId()
    const storageUser = `favList_${userId}`;

    let userFavList = JSON.parse(localStorage.getItem(storageUser)) || [];
    console.log('userFavList',userFavList)
    if (userFavList.length === 0) {
        noEventFound()
     } else {
        cleanEventContainer() 
         userFavList.forEach(event => {
             createEventCardWithAnimation(event);
         });
     }
    hideEditProfileForm()
    hidePreviewContainer()
}

/**
 * @param {Event} event 
 * @param {HTMLElement} eventContainer
 */ 
export function createEventCardWithAnimation(event){
    const card = createEventCardElement(event); 
    card.classList.add('zoom-in'); 
    card.addEventListener('animationend', () => {
        card.classList.remove('zoom-in');
    });

    return card;
}

function displayUserNickname() {
    let profileUsername = document.querySelector('.profile-username')
    if (!isUserLoggedIn()) {
        profileUsername.innerText = `PROFILE`
        return
    } else {
        const userNickname = getUserNickname()
        profileUsername.innerText = `${userNickname.toUpperCase()}`
    }
}

function showLogoutButton() {
    let loginButton = document.querySelector('.login-button')
    let registerButton = document.querySelector('.register')
    let logoutButton = document.querySelector('.log-out')
    if (!isUserLoggedIn()) {
        return
    } else {
        loginButton.style.display = 'none'
        registerButton.style.display = 'none'
        logoutButton.style.display = 'block'
    }
}

/**
 * 
 * @param {Event} event 
 */ 

 function createEventCardElement(event) {
    const eventContainer = document.querySelector('.event-container');

    const eventCardComponent = document.createElement('event-card');
    eventCardComponent.className = 'event-card-component';
    let eventToComponent = JSON.stringify(event)
    let eventUrl = event.url
    let eventUserId = event.user_id
    let eventName = event.name 
    let eventPrice = event.price
    let eventCurrency = event.currency
    let eventVenue = event.venue
    let eventDateTime = event.dateTime
    let eventMusic = event.music
    let eventCity = event.city
    let eventCountry = event.country
    let eventDance = event.dance
    console.log('eventUserId',eventUserId)


    eventCardComponent.setAttribute('event', eventToComponent)
    eventCardComponent.setAttribute('eventUrl', eventUrl)
    eventCardComponent.setAttribute('eventName', eventName)
    eventCardComponent.setAttribute('eventPrice', eventPrice)
    eventCardComponent.setAttribute('eventCurrency', eventCurrency)
    eventCardComponent.setAttribute('eventVenue', eventVenue)
    eventCardComponent.setAttribute('eventDateTime', eventDateTime)
    eventCardComponent.setAttribute('eventMusic', eventMusic)
    eventCardComponent.setAttribute('eventCity', eventCity)
    eventCardComponent.setAttribute('eventCountry', eventCountry)
    eventCardComponent.setAttribute('eventDance', eventDance)

    eventContainer.appendChild(eventCardComponent)

    return (eventCardComponent);
}
/**
 * @param {string} tag
 * @param {string} className
 * @param {string} textContent
 */ 

export function createElementWithText(tag, className, textContent) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = textContent;
    return element;
}


export function setLocalStorageFromState(key = 'eventStorage') {
    const storeData = store.getState()
    delete storeData.user
    updateLocalStorage(storeData, key)
}

/**
 * @param {String} storeValue
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
    
    eventContainer?.appendChild(errorImg);
}

export function cleanEventContainer() {
    const eventContainer = document.querySelector('.event-container');
    while (eventContainer?.firstChild) {
        eventContainer.removeChild(eventContainer.firstChild);
    }
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
            newElement.href = '';
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

export async function displayMyEvents() {
    hideCreateEvents()
    hideEditProfileForm() 
    hidePreviewContainer() 
    hideEditEvents() 
    const userId = getUserId()
    const filterValue = userId;  
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/events/${filterValue}`);
    if (apiData.length === 0) {
        noEventFound()
     } else {
        
        cleanEventContainer() 
         apiData.forEach(e => {
            const myEventCard = createEventCardWithAnimation(e);
            console.log(myEventCard)
        });
    }
} 
   

 export function hideEditEvents(){
    const eventEditor = document.getElementById('edit-event-form-container')
    if (eventEditor) {
        eventEditor.style.display = 'none';
    }
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
    
    if (eventCreator?.style.display === 'none') {
        eventCreator.style.display = 'block';
        if (cancelChangesEventButton) {
            cancelChangesEventButton.remove();
        }
        if (saveChangesEventButton) {
            saveChangesEventButton.remove();
        }
        const submitButton = document.querySelector('#submit-button') 
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
export function hidePreviewContainer () {
    let previewContainer = document.querySelector('.preview-container'); 
    if (previewContainer) {
        previewContainer.remove() 
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
    console.log('displayevent to buy',event)
    createEventCardWithAnimation(event)
}

function continueToCheckout() {   
    let containerSignIn = document.querySelector('.container-signin')
    const guestCheckoutButton = document.querySelector('.guest-checkout-button')
    if (!isUserLoggedIn()) {
        guestCheckoutButton?.addEventListener('click', () => displayCheckoutForm(containerSignIn))
        return
    } else{
        containerSignIn.innerHTML = '<h1> Continue to:<button class="checkout-button"> checkout</button>.</h1>'  
        const checkoutButton = document.querySelector('.checkout-button')
        checkoutButton?.addEventListener('click', () => displayCheckoutForm(containerSignIn))      
    }
}

/**
 * @param {HTMLElement} containerSignIn
 */

function displayCheckoutForm(containerSignIn) {
    const event = getEventFromBasketStorage()
    const ticketList = JSON.parse(localStorage.getItem('ticketList'))
    console.log('ticketlist',ticketList)
    const eventContainer = document.querySelector('.event-container');
    const checkoutContainer = document.getElementById('checkout-form');
    checkoutContainer.style.display = 'block';
    eventContainer.style.display = 'none';
    containerSignIn.style.display = 'none';
    
    let event_id=event._id
    let eventName=event.name
    let eventPrice=event.price
    console.log('eventname',eventName)
    
    const eventIndex = ticketList.findIndex(item => item.name === eventName);
    let ticketCount = ticketList[eventIndex].count 
    console.log('ticketcount',ticketCount)
    checkoutContainer?.setAttribute('eventId', event_id)
    checkoutContainer?.setAttribute('eventName', eventName)
    checkoutContainer?.setAttribute('eventPrice', eventPrice)
    checkoutContainer?.setAttribute('ticketCount', ticketCount)
    console.log('checkoutcontainer',checkoutContainer)
}

//========================REGISTER===============================//

/**
 * Handles a successful register from the register component
 * @param {CustomEvent} customEvent - The userList returned from the API
 * @returns void
 */
function onRegisterComponentSubmit (customEvent) {
    let userListData = customEvent.detail
    saveUserListToLocalStorage(userListData)
    alert('User registered successfully')
    navigateTo('./login.html')
}

/**
 * Navigates to the specified path
 * @param {string} pathname
 */

export function navigateTo(pathname) {
    const newLocation = {
        ...window.location.href = pathname,
    }
    window.history.pushState({}, '', pathname)
    const newLocationLinked = location.pathname.replace(/\/src/, '')
    console.log(newLocation)
    console.log(newLocationLinked)
}

/**
 * @param {Object} userList
 */
function saveUserListToLocalStorage(userList) {
    localStorage.setItem('userList', JSON.stringify(userList));
}

/**
# * @param {String} storeValue
 */
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
 * @param {Object} apiData - The user data returned from the API
 * @param {Object} [apiData.detail] - Message errors
 * @returns void
 */
function onLoginComponentSubmit(apiData) {
    console.log(`DESDE FUERA DEL COMPONENTE:`, apiData);
    if ('_id' in apiData
      && 'email' in apiData
      && 'nickname' in apiData
      && 'rol' in apiData
      && 'token' in apiData) {
      const userData = (apiData)
      updateSessionStorage({ user: userData })
      // Redirect to PROFILE
      navigateTo('./profile.html')
    } else {
      alert('Invalid user data')
    }
  }

function   getDataFromLocalStorage() {
    const defaultValue = JSON.stringify(INITIAL_STATE)
    return JSON.parse(localStorage.getItem('userList') || defaultValue)
  }

export function getDataFromSessionStorage() {
    const sessionDefaultValue = JSON.stringify({user:[]})
    return JSON.parse(sessionStorage.getItem('userList') || sessionDefaultValue)
}

export function getBasketFromLocalStorage() {
    const basketData = JSON.parse(localStorage.getItem('basket'))
    return basketData
}
  
function checkLoginStatus() {
    const storedData = getDataFromSessionStorage()
    if (storedData?.user?.token) {
      const storeUserData = (storedData?.user)
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
    userContainer?.appendChild(userCard);
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
    //const userFollowedBy = user.followedBy
    const followerNumber = createElementWithText('p', 'follower-number', `Followers: ${user.followedBy.length}`);
    
    const followRate = createFollowRateButtons(user)
    profileInfo.append(nickname,bio,teamAcademy,followRate,followerNumber)

    return profileInfo
}

/**
 * 
 * @param {User} user
 */ 
function createBio(user) {
    const bioContainer = document.createElement('p')
    bioContainer.className = 'bio'
    const bio = user.bio
    const rol = user.rol
    bioContainer.innerText = `${bio}. Role: ${rol}`
    return bioContainer
}

/**
 * 
 * @param {User} user
 */ 
function createFollowRateButtons(user) {
    const followRate = document.createElement('div')
    const followButton = createFollowButton(user)   
    const rateButton = createRateButton(user) 
    followRate.append(followButton,rateButton)
    return followRate
}

/**
 * @param {User} user
 */ 
function createFollowButton(user) {
    const userFollowedId = user._id
    console.log('userfollowedID',userFollowedId)
    const currentUserId= getUserId()
    console.log('currentuserID',currentUserId)

    const userFollowedBy = user.followedBy

    const followButton = document.createElement('button')
    followButton.className = 'follow-button'
    followButton.innerText = 'Follow'
    
    if (userFollowedBy && userFollowedBy.includes(currentUserId)) {
        followButton.classList.add('unfollow');
        followButton.innerText = 'Unfollow'
    } else {
         followButton.innerText = 'Follow'
    }    
    followButton.addEventListener('click',() => onFollowButtonClick(userFollowedBy,userFollowedId,currentUserId,followButton))
    return followButton
}

/**
 * 
 * @param {String} userFollowedBy
 * @param {String} userFollowedId
 * @param {String} currentUserId
 * @param {HTMLElement} followButton
 */ 
function onFollowButtonClick(userFollowedBy,userFollowedId,currentUserId,followButton) { 
    console.log('user inside onFollowButtonClick',userFollowedBy)
    if(userFollowedBy && userFollowedBy.includes(currentUserId)){
    removeFollower(userFollowedId,currentUserId)
    } else {
    addFollower(userFollowedId,currentUserId)
    } 
    toggleFollowButton(userFollowedBy,userFollowedId,currentUserId,followButton) 
}
/**
 * 
 * @param {String} userFollowedId
 * @param {String} currentUserId
 */ 
async function addFollower(userFollowedId,currentUserId){
    const userFollowerNumber = document.querySelector('.follower-number')
    let userNewFollower = {
        followedBy: currentUserId
    }

    const payload = JSON.stringify(userNewFollower)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/followedBy/users/${userFollowedId}`, "PUT",payload);
    console.log(apiData)
    const apiDataUpdated = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/user/${userFollowedId}`, "GET");
    const userFollowerNumberUpdated = apiDataUpdated.followedBy.length
    userFollowerNumber.innerText = `Followers: ${userFollowerNumberUpdated}`
}

/**
 * 
 * @param {String} userFollowedId
 * @param {String} currentUserId
 */ 
async function removeFollower(userFollowedId, currentUserId) {
    const userFollowerNumber = document.querySelector('.follower-number')

    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/user/${userFollowedId}`, "GET");
    const userFollowedBy = apiData.followedBy;

    const index = userFollowedBy.indexOf(currentUserId);
    if (index !== -1) {
        userFollowedBy.splice(index, 1);
    }   
    let newUserFollowedBy = {
        followedBy: userFollowedBy
    }
    const payload = JSON.stringify(newUserFollowedBy);
    const response = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/update/users/${userFollowedId}`, "PUT",payload);
    const apiDataUpdated = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/user/${userFollowedId}`, "GET");
    const userFollowerNumberUpdated = apiDataUpdated.followedBy.length
    userFollowerNumber.innerText = `Followers: ${userFollowerNumberUpdated}`
    
    console.log('response', response)
}
/**
 * 
 * @param {String} userFollowedBy
 * @param {String} userFollowedId
 * @param {String} currentUserId
 * @param {HTMLElement} followButton
 */ 
function toggleFollowButton(userFollowedBy,userFollowedId,currentUserId,followButton) {
    if (followButton.className === 'follow-button') {
        followButton.classList.add('unfollow');
        followButton.innerText = 'Unfollow'

    } else {
        followButton.className='follow-button';
        followButton.innerText = 'Follow'
    }
}

function createRateButton(user) {
    const rateButton = document.createElement('button')
    rateButton.className = 'rate-button'
    rateButton.innerText = 'Rate'
    rateButton.addEventListener('click',() => onRateButtonClick(user))
    return rateButton
}

function onRateButtonClick(user) {
    saveUserToLocalStorage(user)
    navigateTo('./reviews.html')
}

//========================REVIEWS================================//
function displayUserToRate () {
    const user = getUserFromLocalStorage()
    console.log('displayuser to rate',user)

    //createUserCardWithAnimation(user)
}

export function getUserFromLocalStorage() {
    const userData =  JSON.parse(localStorage.getItem('userToRate'))
    const userToRate = userData
    console.log('this is userToRate',userToRate)
    return userToRate
    
}

function saveUserToLocalStorage(user) {
    let userToRateData = [];
    userToRateData.push(user);
    localStorage.setItem('userToRate', JSON.stringify(userToRateData));
    console.log('userToRateData',userToRateData)
}
//========================BACKEND================================//

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {any} [data]
 */
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

export function getEventFromBasketStorage() {
    const eventData = getBasketFromLocalStorage()
    const eventToget = eventData[0]
    console.log('this is eventdata from basket',eventToget)
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