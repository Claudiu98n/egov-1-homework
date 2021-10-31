'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {

    async confirmPayment(ctx) {
        const {addressState, paymentState, totalPrice} = ctx.request.body;

        try {
            await strapi.services['tickets'].create({
                ...addressState,
                totalPrice
            });
    
            await strapi.services['payments'].create({
                cardHolder: paymentState.cardHolder,
                cardNumber: Number(paymentState.cardNumber),
                expDate: paymentState.expDate,
                cardType: paymentState.cardType
            });
    
        } catch(e) {
            console.log(e.message);
        }

        return true;
    }

};
