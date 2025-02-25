import CheckoutFormCss from './CheckoutFormCss.css' with { type: 'css' }


import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

/**
 * Checkout Form  Web Component
 * @class CheckoutForm
 * @emits 'Checkout-form'
 */

export class CheckoutForm extends LitElement {
    static styles = [ CheckoutFormCss];

    static properties = { 
        prueba: {type: String},
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
                    <form action="/action_page.php">
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
                                <hr>
                                <p>Total <span class="price" style="color:black"><b>${this._totalPrice}</b></span></p>
                            </div>
                        </div>
                            <label>
                                <input type="checkbox" checked="checked" name="sameadr"> Shipping address same as billing
                            </label>
                            <input type="submit" value="Continue to checkout" class="btn">
                    </form>
                </div>
            </div>
           
        </div>
        `
    }

    /*=========PRIVATE METHODS============*/


}

customElements.define('checkout-form', CheckoutForm)