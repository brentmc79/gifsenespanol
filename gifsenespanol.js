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

  this.start = function() {
    twit.get('users/lookup', { screen_name: screenName }, function(err, data){
      userId = data[0].id;
      console.log('Found user @'+screenName+" with id: "+userId.toString());
      translator.translate('Se inicializa API de traducción.', 'en', function(err, translation) {
        console.log(translation.translatedText);
        stream = twit.stream('statuses/filter', { follow: [userId] });
        stream.on('tweet', function (tweet) {
          var tweetId = tweet.id_str;

          console.log(tweet);
          console.log('');

          translator.translate(tweet.text, 'es', function(err, translation) {
            var translation_text = translation.translatedText;

            var statuses = this.composeStatuses(translation_text).reverse();
            for(status in statuses)
              setTimeout(function(){
                this.reply(tweetId, statuses.pop());
              }, 3000*status);

            console.log('');
          });
        });
        console.log('GIFs En Espanol: RUNNING.');
      });
    });
  }

  this.subject = function() {
    return '@'.concat(subject_sn);
  }

  this.reply = function(tweetId, text) {
    console.log('About to tweet: "'+text+'"');
    console.log('In reply to tweet id: '+tweetId);

    twit.post('statuses/update', {status: text, in_reply_to_status_id: tweetId}, function(err, data, resp) {
      if(err != null)
        console.log('err: '+err.toString());
      else {
        console.log('');
        console.log('Status successfully posted: '+data.id);
        console.log(data);
      }
    });
  }

  this.composeStatuses = function(text){
    if(text.length < 1)
      return [];
    else {
      var textArray = text.split(' ').reverse();
      var newStatus = '.'.concat(this.subject());

      while(newStatus.length < 139 && textArray.length > 0)
        newStatus = newStatus.concat(' ', textArray.pop());

      var remainingText = textArray.reverse().join(' ');
      var statuses = composeStatuses(remainingText);
      statuses.reverse().push(newStatus);
      return statuses.reverse();
    }
  }

}

(function(){
  var translatorBot = new TranslatorBot('gifsinwords');
  setTimeout(translatorBot.start, 1000);
})();

//var Twit = require('twit')
  //, config = require('./config');
//var twit = new Twit(config)
    //, googleTranslate = require('google-translate')(process.env.GOOGLE_TRANSLATE_API_KEY)
//
//var subject_sn = 'gifsinwords'
		//, stream = null
		//, subject_id = null;
//
//var init = function() {
	//twit.get('users/lookup', { screen_name: subject_sn }, function(err, data){
		//subject_id = data[0].id;
//console.log(subject_id);
		//stream = twit.stream('statuses/filter', { follow: [subject_id] });
	//});
//}
//
//var subject = function() {
	//return '@'.concat(subject_sn);
//}
//
//var reply = function(tweet_id, text) {
  //console.log('About to tweet: "'+text+'"');
  //console.log('In reply to tweet id: '+tweet_id);
//
  //twit.post('statuses/update', {status: text, in_reply_to_status_id: tweet_id}, function(err, data, resp) {
    //if(err != null)
      //console.log('err: '+err.toString());
    //else {
			//console.log('');
			//console.log('Status successfully posted: '+data.id);
			//console.log(data);
		//}
  //});
//}
//var composeStatuses = function(text){
	//if(text.length < 1)
		//return [];
	//else {
	  //var textArray = text.split(' ').reverse();
	  //var newStatus = '.'.concat(subject());
//
	  //while(newStatus.length < 139 && textArray.length > 0)
		  //newStatus = newStatus.concat(' ', textArray.pop());
//
	  //var remainingText = textArray.reverse().join(' ');
	  //var statuses = composeStatuses(remainingText);
    //statuses.reverse().push(newStatus);
		//return statuses.reverse();
	//}
//}
//
//var start = function() {
  //stream.on('tweet', function (tweet) {
    //var tweet_id = tweet.id_str;

    //console.log(tweet);
    //console.log('');
//
    //googleTranslate.translate(tweet.text, 'es', function(err, translation) {
      //var translation_text = translation.translatedText;
//
			//var statuses = composeStatuses(translation_text).reverse();
			//for(status in statuses)
        //setTimeout(function(){
					//reply(tweet_id, statuses.pop());
				//}, 3000*status);
//
      //console.log('');
    //});
  //});
  //console.log('GIFs En Espanol: RUNNING.');
//}
//
//init();
//googleTranslate.translate('Se inicializa API de traducción.', 'en', function(err, translation) {
  //console.log(translation.translatedText);
  //start();
//});
