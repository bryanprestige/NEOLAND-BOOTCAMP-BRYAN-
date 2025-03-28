/* 
//@ts-check
    */
import { simpleFetch } from './lib/simpleFetch.js'
import { HttpError } from './classes/HttpError.js'
/**
 * @import {Event} from './classes/Event.js'
 * @import {User}   from './classes/User.js'
 * @import {Ratings} from './classes/Ratings.js'
 */

export const PORT = location.port ? `:${location.port}` : ''

document.addEventListener('DOMContentLoaded', () => {
    displayUserNickname()
    hideLoginRegisterButtons()
    const logOutButton = document.getElementsByClassName('log-out');
    logOutButton[0]?.addEventListener('click', onLogoutClick);

    if (window.location.pathname.includes('profile.html')) {
        if(!isUserLoggedIn()){
            alert('need to login or register to enjoy all the perks!')
            navigateTo('./login.html')
        }else{

        showLogoutButton()
        displayMyEventsPurchased();
        displayMyRatings()
        const showLessButton = document.getElementById('less-ratings-button');
        showLessButton?.addEventListener('click', () => onClickShowLess());
        }
    }
    else if (window.location.pathname.includes('login.html')) {
        window.addEventListener('login-form-submit', (event) => {
            onLoginComponentSubmit(/** @type {CustomEvent} */(event).detail)
          })        
    }
    else if (window.location.pathname.includes('basket.html')) {
        displayEventToBuy()
        continueToCheckout()
    }
    else if (window.location.pathname.includes('reviews.html')) {
        if(!isUserLoggedIn()){
            alert('need to login or register to enjoy all the perks!')
            navigateTo('./login.html')
        }
    }
    else if (window.location.pathname.includes('index.html')) {
        updateDefaultFeed() 

        const favoriteButton = document.getElementById('favorite-button');
        favoriteButton?.addEventListener('click', displayFavoriteEvents);        
    }
    checkLoginStatus()
});


//====================FEED=====================//

async function updateDefaultFeed() {
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/read/events?`,'GET');
    apiData.forEach((/** @type {Event}  */event) => {
        createEventCardWithAnimation(event);
    });
}

/**
 * @param {Event} event 
 */ 
export function createEventCardWithAnimation(event){
    const card = createEventCardElement(event); 
    card.classList.add('zoom-in'); 
    card.addEventListener('animationend', () => {
        card.classList.remove('zoom-in');
    });
    return card;
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
    let eventName = event.name 
    let eventPrice = event.price
    let eventCurrency = event.currency
    let eventVenue = event.venue
    let eventDateTime = event.dateTime
    let eventMusic = event.music
    let eventCity = event.city
    let eventCountry = event.country
    let eventDance = event.dance

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

    eventContainer?.appendChild(eventCardComponent)
    return (eventCardComponent);
}

/**
 * @param {MouseEvent} event
 */
export async function onFilterButtonClick(event) {
    const targetEvent = event.target;
    
    if (targetEvent instanceof HTMLElement) {
      const filterValue = targetEvent.textContent?.toLowerCase();  
      
      const eventContainer = document.querySelector('.event-container');
      const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/events/${filterValue}`);
    
      if (!apiData) return;
      if (!eventContainer) return;
      cleanEventContainer();
    
      apiData.forEach((/** @type {Event}  */event) => {
          createEventCardWithAnimation(event);
      })
   
      scrollToTop();   
    } else {
      console.error('Target event is not an HTMLElement');
    }
}

//======================== CREATES PROFILE===============================//
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

function createEditEventButton() {
    const editButton = document.createElement('button')
    editButton.className = 'edit-event-button'
    editButton.innerText = 'EDIT'
    editButton.addEventListener('click',displayCreateEvents) 
    return editButton
}

function createPublishButton() {
    const publishButton = document.createElement('button')
    publishButton.className = 'publish-button'
    publishButton.innerText = 'PUBLISH'
     
    publishButton.addEventListener('click', () => {  
        postEvent()
    })
    return publishButton
}

//========================HIDE/DISPLAY IN PROFILE===============================//

async function displayMyEventsPurchased() {
    const userId = getUserId()
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/read/events`);

    if (!apiData) {
        return
    } else{
        myEventsPurchased(apiData,userId)
    }
}

/**
 * @param {Array <Event>} apiData 
 * @param {string} userId
 */ 
function myEventsPurchased (apiData,userId) {
    const myOrdersContainer = document.getElementsByClassName('my-orders');
    const noOrders = document.getElementsByClassName('no-orders');
    apiData.forEach((/** @type {Event}  */event) => {
        const boughtBy = event.boughtBy;

        if (boughtBy && boughtBy.includes(userId)) {
            const eventName = event.name;
            const newElement = document.createElement('button');
            newElement.innerText = ` ${eventName}`;
            newElement.className = 'my-orders-button';

            newElement.addEventListener('click', () => {
                getQrCode()
            })

            myOrdersContainer[0].appendChild(newElement);
        }
    });

    if (myOrdersContainer[0].childElementCount === 0) {
        if (noOrders[0] instanceof HTMLElement) {
        noOrders[0].style.display = 'block';
        }
    } else {
        if (noOrders[0] instanceof HTMLElement) {
            noOrders[0].style.display = 'none';
        }
    }
}

function getQrCode() {
    const qrCode = document.querySelector('.qr-code')
    qrCode?.classList.toggle('appear')
}
export function displayCreateEvents () {
    cleanEventContainer();
    hideEditProfileForm();
    hideEditEvents()
    const eventCreator = document.getElementById('event-creator');
    
    if (eventCreator?.style.display === 'none') {
        eventCreator.style.display = 'block';
       
    } else {
         if (eventCreator) {
        eventCreator.style.display = 'none';
        }
    }
    hidePreviewContainer();
}

async function postEvent() {
    cleanEventContainer()
    const newTitleEvent = document.getElementById('main-title-event');
    if (newTitleEvent) {
        newTitleEvent.innerText = 'Now you can go to the feed, everybody can see your event! Thanks for contributing to the dance community!';
    }
    let newEvent = JSON.parse(localStorage.getItem('newEventList')); 
    const payload = JSON.stringify(newEvent[0])
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/create/event?`,'POST',payload);
    console.log('this is the new event posted',apiData)
    hidePreviewContainer()
}

async function displayMyRatings() {
    /** @type {{ user: any } | null} */
    const getUser = getDataFromSessionStorage()
    const showMoreButton = document.getElementById('more-ratings-button');

    const userId = getUser?.user._id
    const filterValue = userId
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/ratings/${filterValue}`);    

    if (!apiData || apiData.length === 0) {
        if (showMoreButton instanceof HTMLElement && showMoreButton.style) {
        showMoreButton.style.display = 'none'
    }
    return
    } else{
        myRatings(apiData)
    }
} 

/**
 * @param {Array <Ratings>} apiData 
 */
function myRatings(apiData) {
    const myRatingsContainer = document.getElementsByClassName('my-ratings');
    const noRatings = document.querySelector('.no-ratings');
    const showMore = document.querySelector('#more-ratings-button');
    const showLess = document.querySelector('#less-ratings-button');
    apiData.sort((a, b) => b.technique - a.technique);
    const sumTechnique = apiData.reduce((acc, current) => {
        if (noRatings instanceof HTMLElement && noRatings.style) {
            noRatings.style.display = 'none';
        }   
        const technique = current.technique
        if (!isNaN(technique)) {
            return acc + technique;
        } else {
            return acc;
        }
    }, 0);
    
    const averageTechnique = sumTechnique / apiData.length;
  
    for (let i = 0; i < 2; i++) {
      ratings(apiData[i]);
    }

    showMore?.addEventListener('click', () => {
        if (showLess instanceof HTMLElement) {
            onClickShowMore(apiData,showLess)
          }
    })

    const averageTechniqueElement = document.createElement('h1');
    averageTechniqueElement.className = 'h1-average-technique';
    averageTechniqueElement.textContent = `Average technique: ${averageTechnique.toFixed(2)}/5`;
    myRatingsContainer[0].appendChild(averageTechniqueElement);
  }

/**
 * @param {Array <Ratings>} apiData 
 * @param {HTMLElement} showLess
 */
function onClickShowMore(apiData,showLess) {
   const moreRatingsButton = document.querySelector('#more-ratings-button');
    let ratingsIndex = 2;

        for (let i = ratingsIndex; i < apiData.length && i < ratingsIndex + 2; i++) {
            ratings(apiData[i]);
        }
        ratingsIndex += 2;
        showLess.style.display = 'block';
    
        if (ratingsIndex >= apiData.length) {
            if (moreRatingsButton instanceof HTMLElement && moreRatingsButton.style) {
                moreRatingsButton.style.display = 'none';
              }
        }
}

function onClickShowLess() {
    const myRatingsContainer = document.getElementsByClassName('my-ratings');
    const moreRatingsButton = document.querySelector('#more-ratings-button');
    const lessRatingsButton = document.querySelector('#less-ratings-button');

    while (myRatingsContainer[0].childElementCount > 3) {
        const lastChild = myRatingsContainer[0].lastChild;
        if (lastChild) {
            myRatingsContainer[0].removeChild(lastChild);
        } else {
            break;
        }
    }
        
    if (lessRatingsButton instanceof HTMLElement) {
        lessRatingsButton.style.display = 'none';
    }
    if (!moreRatingsButton) {
        return
    }else{
        if (moreRatingsButton instanceof HTMLElement && moreRatingsButton.style) {
            moreRatingsButton.style.display = 'block';
        }
    }
}

/**
 * @param {Ratings} rating
 */
function ratings(rating) {
    const myRatingsContainer = document.getElementsByClassName('my-ratings');
    const newElement = document.createElement('h1');
    const userRatingNickname = rating.nicknameUserRating

    newElement.className = 'h1-rating';
    newElement.textContent = `${userRatingNickname} says:"
        ${rating.comments}" and i value its technique in a ${rating.technique},
        when we danced ${rating.danceStyle}`;

    myRatingsContainer[0].appendChild(newElement);
}


export function displayFavoriteEvents() {
    hideCreateEvents()
    hideEditEvents()
    const userId = getUserId()
    const storageUser = `favList_${userId}`;
    let userFavList = JSON.parse(localStorage.getItem(storageUser)) || [];

    if (userFavList.length === 0) {
        noEventFound()
     } else {
        cleanEventContainer() 
         userFavList.forEach((/** @type {Event}  */event) => {
             createEventCardWithAnimation(event);
         });
     }

    hideEditProfileForm()
    hidePreviewContainer()
}

export function displayEditForm() {
    const editForm = document.getElementById('edit-profile-form-container');
    if (editForm) {
        editForm.style.display = 'block';
        cleanEventContainer()
        hidePreviewContainer()
        hideCreateEvents()
        hideEditEvents()
    } else {
        console.error("Could not find element with id 'edit-profile-form-container'");
    }
}

export function hideEditEvents(){
    const eventEditor = document.getElementById('event-editor')
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

export function hideEditProfileForm() {
    const editForm = document.getElementById('edit-profile-form-container');
    if (editForm) {
        editForm.style.display = 'none';
    }}

export function hidePreviewContainer () {
    let previewContainer = document.querySelector('.preview-container'); 
    if (previewContainer) {
        previewContainer.remove() 
     }
}
//========================BASKET===============================//

function displayEventToBuy () {
    const event = getEventFromBasketStorage()
    createEventCardWithAnimation(event)
}

function continueToCheckout() {   
    let containerSignIn = document.querySelector('.container-signin')
    const guestCheckoutButton = document.querySelector('.guest-checkout-button')
    if (!isUserLoggedIn()) {
        guestCheckoutButton?.addEventListener('click', () => {
            if (containerSignIn instanceof HTMLElement) {
                displayCheckoutForm(containerSignIn)
            } else {
                console.error('containerSignIn is null')
            }
        })
        return
    } else{
        
        if (containerSignIn instanceof HTMLElement) {
            containerSignIn.innerHTML = '<h1> Continue to <button class="checkout-button"> checkout</button>.</h1>'
            const checkoutButton = document.querySelector('.checkout-button')
            checkoutButton?.addEventListener('click', () => displayCheckoutForm(containerSignIn))
        } else {
            console.error('containerSignIn is null')
        }  
    }
}

/**
 * @param {HTMLElement} containerSignIn
 */

function displayCheckoutForm(containerSignIn) {
    const eventContainer = document.querySelector('.event-container');
    const checkoutContainer = document.getElementById('checkout-form');
    containerSignIn.style.display = 'none';
    
    if (eventContainer instanceof HTMLElement && eventContainer.style) {
        eventContainer.style.display = 'none';
      }
     if (checkoutContainer instanceof HTMLElement && checkoutContainer.style) {
         checkoutContainer.style.display = 'block';  
     } 
    
    setCheckoutFormValues()
}

function setCheckoutFormValues() {
    const checkoutContainer = document.getElementById('checkout-form');
    const event = getEventFromBasketStorage()
    const ticketList = JSON.parse(localStorage.getItem('ticketList'))

    let event_id=event._id
    let eventName=event.name
    let eventPrice=event.price

    const eventIndex = ticketList.findIndex((/** @type {Event}  */item) => item.name === eventName);
    let ticketCount = ticketList[eventIndex].count 

    checkoutContainer?.setAttribute('eventId', event_id)
    checkoutContainer?.setAttribute('eventName', eventName)
    checkoutContainer?.setAttribute('eventPrice', eventPrice)
    checkoutContainer?.setAttribute('ticketCount', ticketCount)
}

//========================CONNECT================================//
/**
 * @param {User} user
 */ 
export function createUserCardWithAnimation(user){
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
    userCard.className = 'profile-card-follow';

    const imagePlaceholder = document.createElement('img')
    imagePlaceholder.className = 'profile-picture-follow'
    imagePlaceholder.src = './imagenes/profile-pic-placeholder.png'

    const profileInfo = createProfileInfo(user,userCard);

    userCard.appendChild(imagePlaceholder);
    userCard.appendChild(profileInfo);

    return userCard;
}

/**
 * 
 * @param {User} user
 */ 
function createProfileInfo(user,userCard){
    const profileInfo = document.createElement('div')
    profileInfo.className ='profile-info'

    console.log(userCard,'usercard')

    const nickname = createElementWithText('h1', 'nickname', user.nickname);
    const bio = createBio(user)
    const teamAcademy = createElementWithText('p', 'team-academy', user.teamAcademy);
    const followRate = createFollowRateButtons(user,userCard)
    
    profileInfo.append(nickname,bio,teamAcademy,followRate)

    if(!user.followedBy) {
        const followerNumber = createElementWithText('p', 'follower-number', `Followers: 0`);
        profileInfo.append(followerNumber)
    }else {
        const followerNumber = createElementWithText('p', 'follower-number', `Followers: ${user.followedBy.length}`);
        profileInfo.append(followerNumber)
    }
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
function createFollowRateButtons(user,userCard) {
    const followRate = document.createElement('div')
    const followButton = createFollowButton(user,userCard)   
    const rateButton = createRateButton(user) 
    followRate.append(followButton,rateButton)
    return followRate
}

/**
 * @param {User} user
 */ 
function createFollowButton(user,userCard) {
    const userFollowedId = user._id
    const currentUserId= getUserId()
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

    followButton.addEventListener('click', () => onFollowButtonClick(userFollowedBy,userFollowedId,currentUserId,followButton,userCard))
    return followButton
}

/**
 * @param {Array<User>} userFollowedBy
 * @param {String} userFollowedId
 * @param {String} currentUserId
 * @param {HTMLElement} followButton
 * @param {HTMLElement} userCard
 */ 
function onFollowButtonClick(userFollowedBy,userFollowedId,currentUserId,followButton,userCard) { 
    if(!isUserLoggedIn()){
        alert('need to login or register to enjoy all the perks!')
        navigateTo('./login.html')
    }else {

        if(userFollowedBy && userFollowedBy.includes(currentUserId)){
        removeFollower(userFollowedId,currentUserId,userCard)
        } else {
        addFollower(userFollowedId,currentUserId,userCard)
        } 
        toggleFollowButton(userFollowedBy,userFollowedId,currentUserId,followButton) 
    }
}

/**
 * @param {String} userFollowedId
 * @param {String} currentUserId
 * @param {HTMLElement} userCard
 */ 
async function addFollower(userFollowedId,currentUserId,userCard) {
    const userFollowerNumber = userCard.querySelector('.follower-number')
    let userNewFollower = {
        followedBy: currentUserId
    }

    const payload = JSON.stringify(userNewFollower)
    const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/followedBy/users/${userFollowedId}`, "PUT",payload);
    console.log(apiData)
    const apiDataUpdated = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/user/${userFollowedId}`, "GET");
    const userFollowerNumberUpdated = apiDataUpdated.followedBy.length
    if (userFollowerNumber instanceof HTMLElement) {
        userFollowerNumber.innerText = `Followers: ${userFollowerNumberUpdated}`;
    }    
}

/**
 * @param {String} userFollowedId
 * @param {String} currentUserId
 * @param {HTMLElement} userCard
 */ 
async function removeFollower(userFollowedId, currentUserId,userCard) {
    const userFollowerNumber = userCard.querySelector('.follower-number')

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
    console.log('response', response)
    const apiDataUpdated = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/filter/user/${userFollowedId}`, "GET");
    const userFollowerNumberUpdated = apiDataUpdated.followedBy.length
    if (userFollowerNumber instanceof HTMLElement) {
        userFollowerNumber.innerText = `Followers: ${userFollowerNumberUpdated}`;
    }
}

/**
 * 
 * @param {Array<User>} userFollowedBy
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

/**
 * @param {User} user
 */ 

function createRateButton(user) {
    const rateButton = document.createElement('button')
    rateButton.className = 'rate-button'
    rateButton.innerText = 'Rate'
    rateButton.addEventListener('click',() => onRateButtonClick(user))
    return rateButton
}

/**
 * @param {User} user
 */ 
function onRateButtonClick(user) {
    if(!isUserLoggedIn()){
        alert('need to login or register to enjoy all the perks!')
        navigateTo('./login.html')
    }else{
    saveUserToLocalStorage(user)
    navigateTo('./reviews.html')
    }
}

//========================APIDATA================================//


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

//========================LOCAL/SESSION STORAGE================================//

/**
 * @param {User} user
 */ 

function saveUserToLocalStorage(user) {
    let userToRateData = [];
    userToRateData.push(user);
    localStorage.setItem('userToRate', JSON.stringify(userToRateData));
}

export function getUserFromLocalStorage() {
    const userData =  JSON.parse(localStorage.getItem('userToRate'))
    const userToRate = userData
    return userToRate
}

export function getDataFromSessionStorage() {
    const sessionDefaultValue = JSON.stringify({user:[]})
    return JSON.parse(sessionStorage.getItem('userList') || sessionDefaultValue)
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

export function getBasketFromLocalStorage() {
    const basketData = JSON.parse(localStorage.getItem('basket'))
    return basketData
}

export function getEventFromBasketStorage() {
    const eventData = getBasketFromLocalStorage()
    const eventToget = eventData[0]
    return eventToget
    
}

/**
 * @param {String} storeValue
 */
export function updateSessionStorage(storeValue) {
    sessionStorage.setItem('userList', JSON.stringify(storeValue))
}

//========================LOGIN===============================//

/**
 * Handles a successful login from the login component
 * @param {Object} apiData - The user data returned from the API
 * @param {Object} [apiData.detail] - Message errors
 * @returns void
 */
function onLoginComponentSubmit(apiData) {
    if ('_id' in apiData
      && 'email' in apiData
      && 'nickname' in apiData
      && 'rol' in apiData
      && 'token' in apiData) {
      updateSessionStorage({user: apiData})
      navigateTo('./profile.html')
    } else {
      alert('Invalid user data')
    }
  }
  
function checkLoginStatus() {
    const storedData = getDataFromSessionStorage()
    if (storedData?.user?.token) {
      const storeUserData = (storedData?.user)
      delete storeUserData.password
    }
}
//========================LOG OUT================================//

function showLogoutButton() {
    let loginButton = document.querySelector('.login-button')
    let registerButton = document.querySelector('.register')
    let logoutButton = document.querySelector('.log-out')
    if (!isUserLoggedIn()) {
        return
    } else {
            /** @type {HTMLElement} */(loginButton).style.display = 'none'
            if (registerButton instanceof HTMLElement && registerButton.style) {
                registerButton.style.display = 'none'
            }
            if (logoutButton instanceof HTMLElement && logoutButton.style) {
            logoutButton.style.display = 'block'
            }
    }
}

function hideLoginRegisterButtons() {
    let loginButton = document.querySelector('.login-button')
    let registerButton = document.querySelector('.register')
    if (!isUserLoggedIn()) {
        return
    } else {
         /** @type {HTMLElement} */(loginButton).style.display = 'none'
         if (registerButton instanceof HTMLElement && registerButton.style) {
            registerButton.style.display = 'none'
        }
    }
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
//========================UTILS===============================//

/**
 * Navigates to the specified path
 * @param {string} pathname
 */

export function navigateTo(pathname) {
    const newLocation = {
        ...window.location.href = pathname,
    }
    window.history.pushState({}, '', pathname)
    const newLocationLinked = window.location.pathname.replace(/\/src/, '')
    console.log(newLocation)
    console.log(newLocationLinked)
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

function displayUserNickname() {
    let profileUsername = document.querySelector('.profile-username')
    const userNickname = getUserNickname()
    if (!isUserLoggedIn()) {
         /** @type {HTMLElement} */ (profileUsername).innerText = `PROFILE`
        return
    } else {
        /** @type {HTMLElement} */ (profileUsername).innerText = `${userNickname.toUpperCase()}`
    }
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
