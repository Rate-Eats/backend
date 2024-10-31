module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/toggle-reaction',
      handler: 'review.toggleReaction',
    }
  ]
}
