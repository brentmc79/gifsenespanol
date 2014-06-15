//
//  GIFs En Espanol - Twitter bot that replies to
//  @gifsinwords with spanish translations
//

var Twit = require('twit'),
    GoogleTranslate = require('google-translate'),
    config = require('./config');

function TranslatorBot(screenName) {
  var screenName = screenName;
  var userId = null;
  var stream = null;
  var translator = GoogleTranslate(process.env.GOOGLE_TRANSLATE_API_KEY);
  var twit = new Twit(config);

  function subject() {
    return '@'.concat(screenName);
  }

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

  function composeStatuses(text){
    if(text.length < 1)
      return [];
    else {
      var textArray = text.split(' ').reverse();
      var newStatus = '.'.concat(subject());

      while(newStatus.length < 139 && textArray.length > 0)
        newStatus = newStatus.concat(' ', textArray.pop());

      var remainingText = textArray.reverse().join(' ');
      var statuses = composeStatuses(remainingText);
      statuses.reverse().push(newStatus);
      return statuses.reverse();
    }
  }

  function reply(tweet){
    var tweetId = tweet.id_str;

    log('');
    log('New tweet: '+tweet.text);

    translator.translate(tweet.text, 'es', function(err, translation) {
      var translation_text = translation.translatedText;

      var statuses = composeStatuses(translation_text).reverse();
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

  this.start = function() {
    twit.get('users/lookup', { screen_name: screenName }, function(err, data){
      userId = data[0].id;
      log('Found user @'+screenName+" with id: "+userId.toString());
      translator.translate('Se inicializa API de traducción.', 'en', function(err, translation) {
        log(translation.translatedText);
        stream = twit.stream('statuses/filter', { follow: [userId] });
        stream.on('tweet', reply)
        log('GIFs En Espanol: RUNNING.');
      });
    });
  }

}

(function(){
  var translatorBot = new TranslatorBot('brentmc79');
  setTimeout(translatorBot.start, 1000);
})();
