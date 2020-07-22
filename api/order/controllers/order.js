"use strict";

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeSecretKey= strapi.config.get('STRIPE_SECRET_KEY');


const stripe = require("stripe")(stripeSecretKey);
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  create: async (ctx) => {
    const { name, address, total, items, stripeTokenId } = ctx.request.body;
    const { id } = ctx.state.user;
    const charge = await stripe.charges.create({
      amount: total * 100,
      currency: "usd",
      description: `Order ${new Date()} by ${ctx.state.user.username}`,
      source: stripeTokenId,
    });

    const order = await strapi.services.order.create({
      name,
      address,
      total,
      items,
      user: id,
    });

    return order;
  },
};
