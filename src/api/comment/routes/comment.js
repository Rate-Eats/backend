'use strict';

/**
 * comment router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter("api::comment.comment", {
  config: {
    update: {
      middlewares: ["api::comment.is-owner"],
    },
    delete: {
      middlewares: ["api::comment.is-owner"],
    },
  },
});
