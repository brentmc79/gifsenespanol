//
//  GIFs En Espanol - Twitter bot that replies to
//  @gifsinwords with spanish translations
//

var Twit = require('twit'),
    GoogleTranslate = require('google-translate'),
    config = require('./config');

function TranslatorBot() {
  var screenName = null;
  var userId = null;
  var stream = null;
  var translator = GoogleTranslate(process.env.GOOGLE_TRANSLATE_API_KEY);
  var twit = new Twit(config);

  function postStatus(tweetId, text) {
    log('About to tweet: "'+text+'"');
    log('In reply to tweet id: '+tweetId);

    twit.post('statuses/update', {status: text, in_reply_to_status_id: tweetId}, function(err, data, resp) {
      if(err != null)
        log('err: '+err.toString());
      else {
        log('Status successfully posted: '+data.id);
      }
    });
  }

  function composeStatuses(recipients, text){
    if(text.length < 1)
      return [];
    else {
      var textArray = text.split(' ').reverse();
      var replyTo = ['@', screenName].join('');
      var newStatus = ['.', replyTo].join('');
      var recipientArray = recipients.split(' ');

      if(recipientArray.indexOf(replyTo) == -1)
        newStatus = [newStatus, recipients].join(' ');
      else {
        recipientArray.splice(recipientArray.indexOf(replyTo), 1)
        recipients = recipientArray.join(' ')
        newStatus = [newStatus, recipients].join(' ');
      }

      while(textArray.length > 0 && (newStatus.length + textArray[textArray.length-1].length) < 139)
        newStatus = [newStatus, textArray.pop()].join(' ');

      var remainingText = textArray.reverse().join(' ');
      var statuses = composeStatuses(recipients, remainingText);
      statuses.reverse().push(newStatus);
      return statuses.reverse();
    }
  }

  function extractMentions(text){
    var matches = text.match(/(\.?@[A-Za-z0-9_]+)/g);
    var key = null;
    var subs = {};
    for(var i=0; i<matches.length; i++){
      key = ['mention', i.toString()].join('');
      subs[key] = matches[i];
      text = text.replace(matches[i], key);
    }
    return [text, subs];
  }

  function replaceMentions(text, map){
    var key = null;
    var keys = Object.keys(map);
    for(var i=0; i<keys.length; i++){
      key = keys[i];
      text = text.replace(key, map[key]);
    }
    return text;
  }

  function reply(tweet){
    screenName = tweet.user.screen_name;
    var tweetId = tweet.id_str;
    var words = tweet.text.split(' ');
    var usernames = '';
    var subtext = '';
    var foundAllRecipients = false;

    for(var i=0; i<words.length; i++){
      var word = words[i];
      if(word.indexOf('.') == 0 && !foundAllRecipients)
        usernames = [usernames, word.substring(1)].join(' ');
      else if(word.indexOf('@') == 0 && !foundAllRecipients)
        usernames = [usernames, word].join(' ');
      else
        foundAllRecipients = true;
        subtext = [subtext, word].join(' ');
    }

    var res = extractMentions(subtext);
    subtext = res[0];
    var mentionMap = res[1];

    translator.translate(subtext, 'es', function(err, translation) {
      var fullText = [usernames, translation.translatedText].join(' ');
      fullText = replaceMentions(fullText, mentionMap);
      var statuses = composeStatuses(usernames, fullText).reverse();
      for(status in statuses)
        setTimeout(function(){
          postStatus(tweetId, statuses.pop());
        }, 3000*status);

    });
  }

  function log(text) {
    var date = new Date();
    console.log(['[',date.toString(), ']: ', text].join(''));
    date = null;
  }

  this.start = function(sn) {
    screenName = sn;
    twit.get('users/lookup', { screen_name: screenName }, function(err, data){
      userId = data[0].id;
      log('Found user @'+screenName+" with id: "+userId.toString());
      translator.translate('Se inicializa API de traducción.', 'en', function(err, translation) {
        log(translation.translatedText);
        stream = twit.stream('statuses/filter', { follow: [userId] });
        stream.on('tweet', function(tweet){
          log('');
          log('New tweet: '+tweet);
          reply(tweet);
        });

        log('GIFs En Espanol: RUNNING.');
      });
    });
  }

  this.post = function(tweetId) {
    twit.get('statuses/show', { id: tweetId },  function (err, tweet, response) {
      log('Status found.');
      reply(tweet)
    })
  }

}

module.exports.TranslatorBot = TranslatorBot;
