"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    const entryId = ctx.params.id ? ctx.params.id : undefined;
    let entry = {};

    if (entryId) {
      entry = await strapi.documents("api::comment.comment").findOne({
        documentId: entryId,
        populate: "*",
      });
    }

    if (user.id !== entry.users.id) {
      return ctx.unauthorized("This action is unauthorized.");
    } else {
      return next();
    }
  };
};
