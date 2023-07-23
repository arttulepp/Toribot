const $ = require("cheerio");
const fs = require("fs");

const newListings = function(listings, url, filepath) {
  let rawdata = fs.readFileSync(filepath);
  let allListings = JSON.parse(rawdata);
  if (!allListings.hasOwnProperty(url)) {
    // if no key, add the key
    // create new key
    allListings[url] = [];
  }
  oldListings = allListings[url]
  //console.log(oldListings);
  let newListingBoolean;
  let newListings = []; // new unique listings

  for(let i = 0; i < listings.length; i++){
      newListingBoolean = true;
      for(let j = 0; j < oldListings.length; j++){
          if (listings[i]["id"] == oldListings[j]["id"]){
              newListingBoolean = false;
              break;
          }
      }
      if(newListingBoolean){
          newListings.push(listings[i]);
      }
  }
  if(newListings.length > 0){
    return newListings;
  } else{return false;}
  
};

module.exports = newListings;

