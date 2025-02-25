import reset from '../../../css/reset.css' with { type: 'css' }
import css from '../../../css/dancingEvents.css' with { type: 'css' }
import appCss from '../../../css/app.css' with { type: 'css' }

import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';

/**
 * Checkout Form  Web Component
 * @class CheckoutForm
 * @emits 'Checkout-form'
 */

export class CheckoutForm extends LitElement {
    static styles = [ css,reset,appCss];

    static properties = { 
        prueba: {type: String},
    };

    constructor() {
        super();
    }

    render() {
        return html`
        `
    }

    /*=========PRIVATE METHODS============*/


}

customElements.define('checkout-form', CheckoutForm)