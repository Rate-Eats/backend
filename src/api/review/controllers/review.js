"use strict";

/**
 * review controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  toggleReaction: async (ctx, next) => {
    const { reviewDocumentId, type } = ctx.request.body;
    const userDocumentId = ctx.state.user.documentId;

    if (!reviewDocumentId || !type) {
      return ctx.badRequest("Review ID and type are required.");
    }

    const existingReaction = await strapi
      .documents("api::reaction.reaction")
      .findFirst({
        filters: {
          user: {
            documentId: {
              $contains: userDocumentId,
            },
          },
          review: {
            documentId: {
              $contains: reviewDocumentId,
            },
          },
        },
      });

    if (existingReaction) {
      if (existingReaction.type === type) {
        await strapi.documents("api::reaction.reaction").delete({
          documentId: existingReaction.documentId,
        });
      } else if (existingReaction.type !== type) {
        await strapi.documents("api::reaction.reaction").update({
          documentId: existingReaction.documentId,
          data: { type: type },
        });
      }
    } else {
      await strapi.documents("api::reaction.reaction").create({
        data: {
          type: type,
          review: {
            connect: [
              {
                documentId: reviewDocumentId,
              },
            ],
          },
          user: {
            connect: [
              {
                documentId: userDocumentId,
              },
            ],
          },
        },
      });
    }
    const likeCount = await strapi.documents("api::reaction.reaction").count({
      filters: {
        type: {
          $eq: "like",
        },
        review: {
          documentId: {
            $contains: reviewDocumentId,
          },
        },
      },
    });
    const dislikeCount = await strapi
      .documents("api::reaction.reaction")
      .count({
        filters: {
          type: {
            $eq: "dislike",
          },
          review: {
            documentId: {
              $contains: reviewDocumentId,
            },
          },
        },
      });

    await strapi.documents("api::review.review").update({
      documentId: reviewDocumentId,
      data: { dislikeCount, likeCount },
    });

    ctx.send({ likeCount: likeCount, dislikeCount: dislikeCount });
  },
}));
