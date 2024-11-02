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

  async afterDelete(event) {
    await handleCommentChange(event, "afterDelete");
  },
};

async function handleCommentChange(event, lifecyclePhase) {
  const {data} = event.params;

  const reviewDocumentId = await fetchReviewDocumentId(
    data?.review?.connect[0]?.id
  );
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
      data: {commentCount: commentCount},
    });
  }
}
