// !add www.tää.fi
const handleListings = require("../webScraping/refreshListings");

const URL = require("url").URL;
const stringIsAValidUrl = (s) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};


module.exports = function(msg, args) {
    let author = msg.author;
    let fileName = author.username + ".json";
    let url = args[0];
    
    if (args.length > 1){
      if(args[1] == "global"){
        author = "global";
        fileName = "global.json"
      }
    }


    if(stringIsAValidUrl(url)){             // check if url is valid
        handleListings.refreshListings(fileName, url, author);
        msg.channel.send("Added new listing for " + author.toString());
    } else {
        msg.channel.send("Invalid URL!");
    }

}
