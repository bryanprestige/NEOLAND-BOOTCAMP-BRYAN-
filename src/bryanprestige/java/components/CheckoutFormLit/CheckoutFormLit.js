import CheckoutFormCss from './CheckoutFormCss.css' with { type: 'css' }
import {getUserId, isUserLoggedIn,navigateTo,getAPIData, PORT} from "../../dancingEvents.js"
import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

/**
 * Checkout Form  Web Component
 * @class CheckoutForm
 * @emits 'checkout-form'
 */

export class CheckoutForm extends LitElement {
    static styles = [ CheckoutFormCss];

    static properties = { 
        prueba: {type: String},
        eventId: {type: String},
    };

    get _totalPrice() {
        const getTotalPrice = JSON.parse(localStorage.getItem('totalPriceValue')) || 0;;
        return  getTotalPrice       
    }

    constructor() {
        super();
    }

    render() {
        return html`
        <div class="checkout-container">
            <div class="col-75">
                <div class="container">
                    <form action="#">
                        <div class="row">
                            <div class="col-50">
                                <h3>Billing Address</h3>
                                <label for="fname"><i class="fa fa-user"></i> Full Name</label>
                                <input type="text" id="fname" name="firstname" placeholder="Buyer Full Name">
                                <label for="email"><i class="fa fa-envelope"></i> Email</label>
                                <input type="text" id="email" name="email" placeholder="Valid Email">
                                <label for="adr"><i class="fa fa-address-card-o"></i> Address</label>
                                <input type="text" id="adr" name="address" >
                                <label for="country"><i class="fa fa-institution"></i> Country</label>
                                <input type="text" id="country" name="country">
                                <div class="row">
                                     <div class="col-50">
                                        <label for="city">City</label>
                                        <input type="text" id="city" name="city">
                                    </div>
                                    <div class="col-50">
                                        <label for="postacl-code">Postal Code</label>
                                        <input type="text" id="postal-code" name="postcal-code">
                                    </div>
                                </div>
                            </div>
                            <div class="col-50">
                                <h3>Payment</h3>
                                <label for="fname">Accepted Cards</label>
                                <div class="icon-container">
                                    <img  class="icons" src="../../../imagenes/icons-card.png">
                                </div>
                                <label for="cname">Name on Card</label>
                                <input type="text" id="cname" name="cardname" placeholder="Buyer Full Name">
                                <label for="ccnum">Credit card number</label>
                                <input type="text" id="ccnum" name="cardnumber" placeholder="1111-2222-3333-4444">
                                <label for="exp-date">Exp Month</label>
                                <input type="text" id="exp-date" name="exp-date" placeholder="01/26" >
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" name="cvv">
                            </div>
                        </div>
                        <div class="col-25">
                            <div class="container-price">
                                <h4>Cart</h4>
                                <p><a href="#">Product 1</a> <span class="price">$15</span></p>
                                <hr>
                                <p>Total <span class="price" style="color:black"><b>${this._totalPrice}</b></span></p>
                            </div>
                        </div>
                            <label>
                                <input type="checkbox" checked="checked" name="sameadr"> Shipping address same as billing
                            </label>
                            <button type="click"  class="btn" @click= ${this._onCheckoutFormClick}> Confirm Payment</button>
                    </form>
                </div>
            </div> 
        </div>
        `
    }

    /*=========PRIVATE METHODS============*/

    _onCheckoutFormClick(e) {
        e.preventDefault();
        if (!isUserLoggedIn()) {
            alert('Thanks for the purchase!, your order has been sent to your email, enjoy dancing');
            return
        } else if(isUserLoggedIn){
            this._updateEventToPurchased(this.eventId) 
            alert('Thanks for the purchase!, you can see your order in your profile, enjoy dancing!');
            navigateTo('./profile.html')
        }
    }

    async _updateEventToPurchased() {
        console.log('eventID dentro de checkout component', this.eventId);
        const userId = getUserId()
        let eventBought = {
            boughtBy: userId,
        }        
        const payload = JSON.stringify(eventBought)
        const apiData = await getAPIData(`${location.protocol}//${location.hostname}${PORT}/api/updateBought/events/${this.eventId}`, "PUT",payload);
        console.log(apiData)
    }
}

customElements.define('checkout-form', CheckoutForm)