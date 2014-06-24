module.exports = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,

  response_language: 'es',
  target_username: 'gifsinwords',
  ignore_retweets: true,
  ignore_replies: false,
  reply_to_usernames: ['gifs']
}
