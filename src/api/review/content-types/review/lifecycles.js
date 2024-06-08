r"use strict";

const calculateSingleRating = (reviews, category) => {
  const validRatings = reviews.filter((rating) => rating[category] !== 0);
  const ratingSum = validRatings.reduce((sum, r) => sum + r[category], 0);
  const averageRating = validRatings.length
    ? ratingSum / validRatings.length
    : 0;
  return {
    rating: averageRating,
    count: validRatings.length,
  };
};

const fetchRestaurant = async (reviewId) => {
  const review = await strapi.entityService.findOne(
    "api::review.review",
    reviewId,
    {
      populate: {
        restaurant: {
          populate: {
            reviews: true,
          },
        },
      },
    }
  );
  return review.restaurant;
};

module.exports = {
  async afterCreate(event) {
    await handleReviewChange(event, "afterCreate");
  },

  async afterUpdate(event) {
    await handleReviewChange(event, "afterCreate");
  },
};

async function handleReviewChange(event, lifecyclePhase) {
  const { result } = event;

  const reviewId = result.id;

  if (reviewId) {
    const restaurant = await fetchRestaurant(reviewId);

    const relatedReviews = restaurant.reviews;
    const ambience = calculateSingleRating(relatedReviews, "rating_ambience");
    const food = calculateSingleRating(relatedReviews, "rating_food");
    const service = calculateSingleRating(relatedReviews, "rating_service");
    const price = calculateSingleRating(relatedReviews, "rating_price");
    const ratingLength = [ambience, food, service, price].filter(
      (rating) => rating.count !== 0
    ).length;
    const medianRating =
      (ambience.rating + food.rating + service.rating + price.rating) /
      ratingLength;

    await strapi.entityService.update(
      "api::restaurant.restaurant",
      restaurant.id,
      {
        data: {
          median_rating: medianRating.toFixed(1),
        },
      }
    );
  }
}
