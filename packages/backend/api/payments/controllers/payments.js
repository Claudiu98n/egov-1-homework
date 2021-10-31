'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    async confirmPayment(ctx) {
        const response = await strapi.services['payments'].confirmPayment(ctx);
        return response;
    }

};
