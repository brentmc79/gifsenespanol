#GIFs En Español

This is a Node-powered Twitter bot (@GifsEnEspanol) that
runs on a Raspberry Pi. There's nothing about the code
that's actually specific to a Raspberry Pi, it's just
a little fun fact.

The bot listens for tweets from @gifsinwords, and replies
back to them with Spanish translations, for no particular
reason other that it was something fun to do.

The bot ignores retweets.

The bot *should* preserve all user mentions, extracting
them out prior to translation, then replacing them once
the translation is complete.

##Setup

Make sure you have ENV var set up for the following:

- TWITTER_CONSUMER_KEY
- TWITTER_CONSUMER_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_ACCESS_TOKEN_SECRET
- GOOGLE_TRANSLATE_API_KEY

To follow an account and post translated replies, run:

    node bin/start.js "gifsinwords"

To reply to a single status, run:

    node bin/reply.js 1234    //where 1234 is a status id
