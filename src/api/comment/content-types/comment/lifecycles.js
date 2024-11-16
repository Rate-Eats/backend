"use strict";

const fetchReviewDocumentId = async (reviewId) => {
  const review = await strapi.documents("api::review.review").findFirst({
    filters: {
      id: {
        $eq: reviewId,
      },
    },
  });
  return review.documentId;
};

module.exports = {
  async afterCreate(event) {
    await handleCommentChange(event, "afterCreate");
  },
  async beforeDelete(event) {
    await handleCommentChange(event, "beforeDelete");
  },
};

async function handleCommentChange(event, lifecyclePhase) {
  const { data } = event.params;

  let reviewDocumentId = "";
  if (lifecyclePhase === "beforeDelete") {
    const comment = await strapi.documents("api::comment.comment").findFirst({
      filters: {
        id: {
          $eq: event.params.where.id,
        },
      },

      populate: {
        review: true,
      },
    });
    reviewDocumentId = comment?.review?.documentId
      ? comment?.review?.documentId
      : "";
  } else {
    reviewDocumentId = await fetchReviewDocumentId(
      data?.review?.connect[0]?.id
    );
  }

  if (reviewDocumentId) {
    const commentCount = await strapi.documents("api::comment.comment").count({
      filters: {
        review: {
          documentId: {
            $eq: reviewDocumentId,
          },
        },
      },
    });

    await strapi.documents("api::review.review").update({
      documentId: reviewDocumentId,
      data: { commentCount: commentCount },
    });
  }
}
