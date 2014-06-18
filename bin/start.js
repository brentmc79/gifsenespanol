var gifsEnEspanol = require('../gifsenespanol');

if(process.argv.length < 3){
  console.log("A status id must be provided as a command line arg.");
  console.log("Ex: node bin/start.js \"gifsinwords\"");
}else{
  var translatorBot = new gifsEnEspanol.TranslatorBot();
  translatorBot.start(process.argv[2]);
}
