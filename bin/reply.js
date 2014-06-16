var gifsEnEspanol = require('../gifsenespanol');

if(process.argv.length < 3){
  console.log("A status id must be provided as a command line arg.");
  console.log("Ex: node bin/reply.js 12345");
}else{
  var tweetId = process.argv[2];
  var translatorBot = new gifsEnEspanol.TranslatorBot();
  translatorBot.post(tweetId);
}
